import * as ts from 'typescript';
import type {
    ImportDeclaration,
    ExportDeclaration,
    SourceFile,
    Identifier,
    Expression,
} from "typescript";

// Node.js core module mapping to Go stdlib modules
const NODE_CORE_MODULES: Record<string, string> = {
    'fs': 'fs',
    'path': 'path',
    'os': 'os',
    'regexp': 'regexp',
    'crypto': 'crypto',
    'encoding': 'encoding',
    'time': 'time',
    'fmt': 'fmt',
    'strings': 'strings',
    'strconv': 'strconv',
    'math': 'math',
    'json': 'encoding/json',
    'net/http': 'net/http',
};

export function ImportsMixin<TBase extends new (...args: any[]) => any>(Base: TBase) {
    class ImportsMixin extends Base {
        private usedPackages: Set<string> = new Set();
        private importedModuleNames: string[] = [];
        private headerImports: string[] = [];
        
        emitImportDeclaration(node: ImportDeclaration): void {
            const moduleSpecifier = node.moduleSpecifier;
            if (moduleSpecifier.kind !== ts.SyntaxKind.StringLiteral) {
                return;
            }
            
            const moduleName = (moduleSpecifier as any).text;
            
            // Check if this is a Node.js core module
            const nodeModule = NODE_CORE_MODULES[moduleName];
            if (nodeModule) {
                this.usedPackages.add(nodeModule);
                if (node.importClause && node.importClause.namedBindings) {
                    const bindings = node.importClause.namedBindings;
                    if (bindings.kind === ts.SyntaxKind.NamespaceImport) {
                        const ns = (bindings as any).name;
                        const nsName = (ns as Identifier).escapedText.toString();
                        this.namespaceImports.set(nsName, nodeModule);
                    }
                }
                return;
            }
            
            // Project import
            const importPath = this.computeImportPath(moduleName);
            const pkgName = importPath.replace(/\//g, '_').replace(/-/g, '_');
            this.importedModuleNames.push(pkgName);
            
            if (!node.importClause) {
                this.usedPackages.add(importPath);
                return;
            }

            const importClause = node.importClause;
            if (importClause.namedBindings) {
                const bindings = importClause.namedBindings;
                if (bindings.kind === ts.SyntaxKind.NamespaceImport) {
                    const ns = (bindings as any).name;
                    const nsName = (ns as Identifier).escapedText.toString();
                    this.namespaceImports.set(nsName, importPath);
                    this.usedPackages.add(importPath);
                } else if (bindings.kind === ts.SyntaxKind.NamedImports) {
                    this.usedPackages.add(importPath);
                }
            } else if (importClause.name) {
                this.usedPackages.add(importPath);
            }
        }

        emitExportDeclaration(node: ExportDeclaration): void {
            // Handled at module level
        }

        emitSourceFile(node: SourceFile): void {
            // Reset for this file
            this.importedModuleNames = [];
            this.usedPackages = new Set();
            this.headerImports = [];
            
            this.currentPackagePath = this.computePackageName(node.fileName);
            
            // Emit package declaration
            this.write("package ");
            this.write(this.currentPackagePath);
            this.writeLine();
            this.writeLine();
            
            // Process imports
            for (const stmt of node.statements) {
                if (stmt.kind === ts.SyntaxKind.ImportDeclaration) {
                    this.emit(stmt);
                }
            }
            
            // Emit imports section
            if (this.importedPackages.size > 0 || this.usedPackages.size > 0) {
                this.write("import (");
                this.writeLine();
                this.increaseIndent();
                
                // Standard library imports
                for (const pkg of this.importedPackages) {
                    this.write("\"");
                    this.write(pkg);
                    this.write("\"");
                    this.writeLine();
                }
                
                // Project imports
                for (const pkg of this.usedPackages) {
                    this.write("\"");
                    this.write(pkg);
                    this.write("\"");
                    this.writeLine();
                }
                
                this.decreaseIndent();
                this.writePunctuation(")");
                this.writeLine();
                this.writeLine();
            }
            
            // Separate declarations from TLD statements
            const declarations: ts.Statement[] = [];
            const functionDeclarations: ts.FunctionDeclaration[] = [];
            const classDeclarations: ts.ClassDeclaration[] = [];
            const interfaceDeclarations: ts.InterfaceDeclaration[] = [];
            const enumDeclarations: ts.EnumDeclaration[] = [];
            const typeAliasDeclarations: ts.TypeAliasDeclaration[] = [];
            const declarationStatements: ts.Statement[] = [];
            const tldStatements: ts.Statement[] = [];
            
            for (const stmt of node.statements) {
                if (stmt.kind === ts.SyntaxKind.ImportDeclaration || 
                    stmt.kind === ts.SyntaxKind.ImportEqualsDeclaration) {
                    continue;
                }
                
                if (ts.isVariableStatement(stmt)) {
                    const hasInitializer = stmt.declarationList.declarations.some(d => d.initializer);
                    if (!hasInitializer) {
                        declarations.push(stmt);
                    } else if (this.isSimpleVariableStatement(stmt)) {
                        declarations.push(stmt);
                    } else {
                        declarationStatements.push(stmt);
                        tldStatements.push(stmt);
                    }
                } else if (ts.isFunctionDeclaration(stmt)) {
                    functionDeclarations.push(stmt);
                    declarations.push(stmt);
                } else if (ts.isClassDeclaration(stmt)) {
                    classDeclarations.push(stmt);
                    declarations.push(stmt);
                } else if (ts.isInterfaceDeclaration(stmt)) {
                    interfaceDeclarations.push(stmt);
                    declarations.push(stmt);
                } else if (ts.isEnumDeclaration(stmt)) {
                    enumDeclarations.push(stmt);
                    declarations.push(stmt);
                } else if (ts.isTypeAliasDeclaration(stmt)) {
                    typeAliasDeclarations.push(stmt);
                    declarations.push(stmt);
                } else {
                    tldStatements.push(stmt);
                }
            }
            
            // STEP 1: Forward declarations for types (hoisting support)
            this.write("// Forward declarations for hoisted types");
            this.writeLine();
            
            // Forward declare classes
            for (const cls of classDeclarations) {
                if (cls.name) {
                    this.write("type ");
                    this.write(this.toPascalCase(this.getTextOfNode(cls.name)));
                    this.write(" struct");
                    this.writeLine();
                }
            }
            
            // Forward declare interfaces
            for (const iface of interfaceDeclarations) {
                if (iface.name) {
                    this.write("type ");
                    this.write(this.toPascalCase(this.getTextOfNode(iface.name)));
                    this.write(" interface");
                    this.writeLine();
                }
            }
            
            // Emit type aliases
            for (const typeAlias of typeAliasDeclarations) {
                this.write("type ");
                this.emit(typeAlias.name);
                this.write(" ");
                this.emit(typeAlias.type);
                this.writeLine();
            }
            
            this.writeLine();
            
            // STEP 2: Forward declarations for functions (hoisting support)
            this.write("// Forward declarations for hoisted functions");
            this.writeLine();
            for (const func of functionDeclarations) {
                this.emitForwardDeclaration(func);
            }
            
            this.writeLine();
            
            // Always emit __tldInitialized flag
            this.write("var __tldInitialized bool = false");
            this.writeLine();
            this.writeLine();
            
            // Emit declarations at package level
            for (const decl of declarations) {
                if (!tldStatements.includes(decl)) {
                    this.emit(decl);
                }
            }
            
            // Emit declarations for variables with complex initializers (types only)
            for (const stmt of declarationStatements) {
                if (ts.isVariableStatement(stmt)) {
                    for (const decl of stmt.declarationList.declarations) {
                        if (decl.initializer) {
                            let typeStr: string;
                            if (decl.type) {
                                typeStr = this.typeToString(decl.type);
                            } else if (this.typeChecker) {
                                try {
                                    const type = this.typeChecker.getTypeAtLocation(decl);
                                    if (type && !(type.flags & ts.TypeFlags.Any)) {
                                        typeStr = this.typeChecker.typeToString(type, decl);
                                        if (typeStr !== "any") {
                                            typeStr = this.mapInferredType(typeStr);
                                        } else {
                                            typeStr = "interface{}";
                                        }
                                    } else {
                                        typeStr = "interface{}";
                                    }
                                } catch {
                                    typeStr = "interface{}";
                                }
                            } else {
                                typeStr = "interface{}";
                            }
                            this.write("var ");
                            this.write(this.getTextOfNode(decl.name));
                            this.writeSpace();
                            this.write(typeStr);
                            this.writeLine();
                        }
                    }
                }
            }
            
            // Always emit __tld() function
            this.writeLine();
            this.write("func __tld() {");
            this.writeLine();
            this.increaseIndent();
            
            // First, call __tld() of all imported modules
            for (const importedPkg of this.importedModuleNames) {
                this.write("if !");
                this.write(importedPkg);
                this.write(".__tldInitialized {");
                this.writeLine();
                this.increaseIndent();
                this.write(importedPkg);
                this.write(".__tld()");
                this.writeLine();
                this.write(importedPkg);
                this.write(".__tldInitialized = true");
                this.writeLine();
                this.decreaseIndent();
                this.writePunctuation("}");
                this.writeLine();
            }
            
            // Then emit this module's TLD statements
            for (const stmt of tldStatements) {
                if (ts.isVariableStatement(stmt)) {
                    for (const decl of stmt.declarationList.declarations) {
                        if (decl.initializer) {
                            const name = this.getTextOfNode(decl.name);
                            this.write(name);
                            this.writeSpace();
                            this.writeOperator("=");
                            this.writeSpace();
                            this.emit(decl.initializer);
                            this.writeLine();
                        }
                    }
                } else {
                    this.emit(stmt);
                    this.writeLine();
                }
            }
            
            this.decreaseIndent();
            this.writePunctuation("}");
            this.writeLine();
        }
        
        private isSimpleVariableStatement(stmt: ts.VariableStatement): boolean {
            for (const decl of stmt.declarationList.declarations) {
                if (decl.initializer) {
                    if (!this.isSimpleExpression(decl.initializer)) {
                        return false;
                    }
                }
            }
            return true;
        }
        
        private isSimpleExpression(expr: Expression): boolean {
            if (ts.isNumericLiteral(expr) || 
                ts.isStringLiteral(expr) || 
                expr.kind === ts.SyntaxKind.TrueKeyword ||
                expr.kind === ts.SyntaxKind.FalseKeyword ||
                expr.kind === ts.SyntaxKind.NullKeyword ||
                expr.kind === ts.SyntaxKind.UndefinedKeyword) {
                return true;
            }
            
            if (ts.isBinaryExpression(expr)) {
                const op = expr.operatorToken.kind;
                if (op === ts.SyntaxKind.PlusToken ||
                    op === ts.SyntaxKind.MinusToken ||
                    op === ts.SyntaxKind.AsteriskToken ||
                    op === ts.SyntaxKind.SlashToken ||
                    op === ts.SyntaxKind.PercentToken ||
                    op === ts.SyntaxKind.AsteriskAsteriskToken) {
                    return this.isSimpleExpression(expr.left) && this.isSimpleExpression(expr.right);
                }
            }
            
            if (ts.isPrefixUnaryExpression(expr)) {
                return this.isSimpleExpression(expr.operand);
            }
            
            if (ts.isParenthesizedExpression(expr)) {
                return this.isSimpleExpression(expr.expression);
            }
            
            return false;
        }
        
        // Emit forward declaration for a function (for hoisting support)
        private emitForwardDeclaration(node: ts.FunctionDeclaration): void {
            if (!node.name) return;
            
            const funcName = this.toPascalCase(this.getTextOfNode(node.name));
            const isExported = this.isExported(node);
            const returnType = node.type ? this.typeToString(node.type) : "";
            
            this.write("func ");
            if (isExported) {
                this.write(funcName);
            } else {
                this.write(funcName.charAt(0).toLowerCase() + funcName.slice(1));
            }
            this.writePunctuation("(");
            this.emitParamsList(node.parameters);
            this.writePunctuation(")");
            if (returnType) {
                this.writeSpace();
                this.write(returnType);
            }
            this.writeLine();
        }
        
        private emitParamsList(params: ts.NodeArray<ts.ParameterDeclaration> | ts.ParameterDeclaration[]): void {
            for (let i = 0; i < params.length; i++) {
                const param = params[i];
                const paramType = param.type ? this.typeToString(param.type) : "interface{}";
                this.write(this.getTextOfNode(param.name));
                this.writeSpace();
                this.write(paramType);
                if (i < params.length - 1) {
                    this.writePunctuation(",");
                    this.writeSpace();
                }
            }
        }
    }
    
    return ImportsMixin;
}
