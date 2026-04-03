import * as ts from 'typescript';
import type {
    ImportDeclaration,
    ExportDeclaration,
    SourceFile,
    Identifier,
    Expression,
} from "typescript";
import { StatementsMixin } from './statements';

// Node.js core module mapping to Typoly stdlib modules
const NODE_CORE_MODULES: Record<string, string> = {
    'fs': 'typoly_std_fs',
    'path': 'typoly_std_path',
    'os': 'typoly_std_os',
    'process': 'typoly_std_process',
    'console': 'typoly_std_console',
    'math': 'typoly_std_math',
    'json': 'typoly_std_json',
    'date': 'typoly_std_date',
    'regexp': 'typoly_std_regexp',
};

// Modules that need #include instead of import (workaround for MSVC C++20 module bugs)
const HEADER_ONLY_MODULES: Record<string, string> = {
    'fs': 'fs.hpp',
};

export class ImportsMixin extends StatementsMixin {
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
    
    emitImportDeclaration(node: ImportDeclaration): void {
        const moduleSpecifier = node.moduleSpecifier;
        if (moduleSpecifier.kind !== ts.SyntaxKind.StringLiteral) {
            return;
        }
        const moduleName = (moduleSpecifier as any).text;
        
        // Check if this is a Node.js core module
        const nodeModule = NODE_CORE_MODULES[moduleName];
        if (nodeModule) {
            this.emitNodeModuleImport(node, moduleName, nodeModule);
            return;
        }
        
        // Regular module import
        const cppModuleName = this.toCppModulePath(moduleName);
        this.importedModuleNames.push(cppModuleName);

        if (!node.importClause) {
            this.writeKeyword("import");
            this.writeSpace();
            this.write(cppModuleName);
            this.writePunctuation(";");
            this.writeLine();
            return;
        }

        const importClause = node.importClause;
        if (importClause.namedBindings) {
            const bindings = importClause.namedBindings;
            if (bindings.kind === ts.SyntaxKind.NamespaceImport) {
                const ns = (bindings as any).name;
                const nsName = (ns as Identifier).escapedText.toString();
                this.namespaceImports.set(nsName, cppModuleName);
                
                this.writeKeyword("import");
                this.writeSpace();
                this.write(cppModuleName);
                this.writePunctuation(";");
                this.writeLine();
            } else if (bindings.kind === ts.SyntaxKind.NamedImports) {
                const elements = (bindings as any).elements;
                if (elements.length > 0) {
                    this.writeKeyword("import");
                    this.writeSpace();
                    this.write(cppModuleName);
                    this.writePunctuation(";");
                    this.writeLine();
                    for (const spec of elements) {
                        const localName = (spec.name as Identifier).escapedText.toString();
                        this.namedImports.set(localName, cppModuleName);
                    }
                }
            }
        } else if (importClause.name) {
            this.writeKeyword("import");
            this.writeSpace();
            this.write(cppModuleName);
            this.writePunctuation(";");
            this.writeLine();
        }
    }
    
    // Handle Node.js core module imports
    private emitNodeModuleImport(node: ImportDeclaration, moduleName: string, cppModuleName: string): void {
        const importClause = node.importClause;
        
        // Check if this module needs #include instead of import
        const headerFile = HEADER_ONLY_MODULES[moduleName];
        if (headerFile) {
            // Use #include for header-only modules
            this.write("#include \"");
            this.write(headerFile);
            this.write("\"");
            this.writeLine();
            
            if (importClause && importClause.namedBindings) {
                const bindings = importClause.namedBindings;
                if (bindings.kind === ts.SyntaxKind.NamespaceImport) {
                    const ns = (bindings as any).name;
                    const nsName = (ns as Identifier).escapedText.toString();
                    this.namespaceImports.set(nsName, cppModuleName);
                    
                    this.writeKeyword("namespace");
                    this.writeSpace();
                    this.write(nsName);
                    this.writeSpace();
                    this.writePunctuation("{");
                    this.writeSpace();
                    this.writeKeyword("using");
                    this.writeSpace();
                    this.writeKeyword("namespace");
                    this.writeSpace();
                    this.write(cppModuleName);
                    this.writePunctuation(";");
                    this.writeSpace();
                    this.writePunctuation("};");
                    this.writeLine();
                }
            }
            return;
        }
        
        // Import the stdlib module normally
        this.writeKeyword("import");
        this.writeSpace();
        this.write(cppModuleName);
        this.writePunctuation(";");
        this.writeLine();
        
        if (!importClause) return;
        
        if (importClause.namedBindings) {
            const bindings = importClause.namedBindings;
            if (bindings.kind === ts.SyntaxKind.NamespaceImport) {
                const ns = (bindings as any).name;
                const nsName = (ns as Identifier).escapedText.toString();
                this.namespaceImports.set(nsName, nsName);
                
                this.writeKeyword("namespace");
                this.writeSpace();
                this.write(nsName);
                this.writeSpace();
                this.writePunctuation("{");
                this.writeSpace();
                this.writeKeyword("using");
                this.writeSpace();
                this.writeKeyword("namespace");
                this.writeSpace();
                this.write(cppModuleName);
                this.writePunctuation(";");
                this.writeSpace();
                this.writePunctuation("};");
                this.writeLine();
            } else if (bindings.kind === ts.SyntaxKind.NamedImports) {
                const elements = (bindings as any).elements;
                for (const spec of elements) {
                    const localName = (spec.name as Identifier).escapedText.toString();
                    const importedName = spec.propertyName 
                        ? (spec.propertyName as Identifier).escapedText.toString() 
                        : localName;
                    this.namedImports.set(localName, cppModuleName);
                    
                    this.writeKeyword("using");
                    this.writeSpace();
                    this.write(cppModuleName);
                    this.writePunctuation("::");
                    this.write(importedName);
                    this.writePunctuation(";");
                    this.writeLine();
                }
            }
        } else if (importClause.name) {
            const localName = (importClause.name as Identifier).escapedText.toString();
            this.namespaceImports.set(localName, localName);
            
            this.writeKeyword("namespace");
            this.writeSpace();
            this.write(localName);
            this.writeSpace();
            this.writePunctuation("{");
            this.writeSpace();
            this.writeKeyword("using");
            this.writeSpace();
            this.writeKeyword("namespace");
            this.writeSpace();
            this.write(cppModuleName);
            this.writePunctuation(";");
            this.writeSpace();
            this.writePunctuation("};");
            this.writeLine();
        }
    }

    emitExportDeclaration(node: ExportDeclaration): void {
        // Handled at module level
    }

    emitSourceFile(node: SourceFile): void {
        this.importedModuleNames = [];
        this.namedImports = new Map();
        const headerImports: string[] = [];
        
        this.currentModuleName = this.computeModuleName(node.fileName);
        
        // First pass: find header-only imports
        for (const stmt of node.statements) {
            if (stmt.kind === ts.SyntaxKind.ImportDeclaration) {
                const imp = stmt as ImportDeclaration;
                const moduleSpecifier = imp.moduleSpecifier;
                if (moduleSpecifier.kind === ts.SyntaxKind.StringLiteral) {
                    const moduleName = (moduleSpecifier as any).text;
                    const headerFile = HEADER_ONLY_MODULES[moduleName];
                    if (headerFile) {
                        headerImports.push(headerFile);
                    }
                }
            }
        }
        
        // Global module fragment - must include headers here
        this.writeKeyword("module");
        this.writePunctuation(";");
        this.writeLine();
        this.write("#include \"typoly_macros.h\"");
        this.writeLine();
        for (const header of headerImports) {
            this.write("#include \"");
            this.write(header);
            this.write("\"");
            this.writeLine();
        }
        this.writeLine();
        
        // Module declaration
        this.writeKeyword("export");
        this.writeSpace();
        this.writeKeyword("module");
        this.writeSpace();
        this.write(this.currentModuleName);
        this.writePunctuation(";");
        this.writeLine();
        this.writeLine();
        
        // Import stdlib
        this.writeKeyword("import");
        this.writeSpace();
        this.write("typoly_std_builtin");
        this.writePunctuation(";");
        this.writeLine();
        
        // Process user imports - must be immediately after module declaration
        for (const stmt of node.statements) {
            if (stmt.kind === ts.SyntaxKind.ImportDeclaration || stmt.kind === ts.SyntaxKind.ImportEqualsDeclaration) {
                this.emit(stmt);
            }
        }
        
        this.writeLine();
        
        // Using namespace after all imports
        this.writeKeyword("using");
        this.writeSpace();
        this.writeKeyword("namespace");
        this.writeSpace();
        this.write("typoly_std_builtin");
        this.writePunctuation(";");
        this.writeLine();
        this.writeLine();
        
        // Categorize statements
        const declarations: ts.Statement[] = [];
        const functionDeclarations: ts.FunctionDeclaration[] = [];
        const classDeclarations: ts.ClassDeclaration[] = [];
        const interfaceDeclarations: ts.InterfaceDeclaration[] = [];
        const enumDeclarations: ts.EnumDeclaration[] = [];
        const typeAliasDeclarations: ts.TypeAliasDeclaration[] = [];
        const declarationStatements: ts.Statement[] = [];
        const tldStatements: ts.Statement[] = [];
        
        for (const stmt of node.statements) {
            if (stmt.kind === ts.SyntaxKind.ImportDeclaration || stmt.kind === ts.SyntaxKind.ImportEqualsDeclaration) {
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
        
        // Start namespace
        this.writeKeyword("namespace");
        this.writeSpace();
        this.write(this.currentModuleName);
        this.writeSpace();
        this.writePunctuation("{");
        this.writeLine();
        this.increaseIndent();
        
        // STEP 1: Forward declarations for types (hoisting support)
        // JavaScript hoists all types, C++ needs forward declarations
        this.writeComment("// Forward declarations for hoisted types");
        this.writeLine();
        
        // Forward declare classes
        for (const cls of classDeclarations) {
            if (cls.name) {
                this.writeKeyword("class");
                this.writeSpace();
                this.emitIdentifierName(cls.name);
                this.writePunctuation(";");
                this.writeLine();
            }
        }
        
        // Forward declare interfaces
        for (const iface of interfaceDeclarations) {
            if (iface.name) {
                this.writeKeyword("struct");
                this.writeSpace();
                this.emitIdentifierName(iface.name);
                this.writePunctuation(";");
                this.writeLine();
            }
        }
        
        // Forward declare enums
        for (const enm of enumDeclarations) {
            if (enm.name) {
                this.writeKeyword("enum");
                this.writeSpace();
                this.writeKeyword("class");
                this.writeSpace();
                this.emitIdentifierName(enm.name);
                this.writePunctuation(";");
                this.writeLine();
            }
        }
        
        // Emit type aliases (can't forward declare, but must come before usage)
        for (const typeAlias of typeAliasDeclarations) {
            if (this.isExported(typeAlias)) {
                this.writeKeyword("export");
                this.writeSpace();
            }
            this.emitTypeAliasDeclaration(typeAlias);
        }
        
        this.writeLine();
        
        // STEP 2: Forward declarations for functions (hoisting support)
        this.writeComment("// Forward declarations for hoisted functions");
        this.writeLine();
        for (const func of functionDeclarations) {
            this.emitForwardDeclaration(func);
        }
        
        this.writeLine();
        
        // Generate import TLD block
        if (this.importedModuleNames.length > 0) {
            this.write("__IMPORT_TLD_BLOCK({");
            this.writeLine();
            this.increaseIndent();
            for (let i = 0; i < this.importedModuleNames.length; i++) {
                this.write("__IMPORT_TLD(");
                this.write(this.importedModuleNames[i]);
                this.write(");");
                this.writeLine();
            }
            this.decreaseIndent();
            this.write("});");
            this.writeLine();
            this.writeLine();
        } else {
            this.write("__IMPORT_TLD_BLOCK_EMPTY();");
            this.writeLine();
            this.writeLine();
        }
        
        // Generate __tld_initialized and __tld function
        this.write("__TLD_INITIALIZED;");
        this.writeLine();
        this.writeLine();
        
        this.write("export void __tld() {");
        this.writeLine();
        this.increaseIndent();
        this.write("__TLD_INIT();");
        this.writeLine();
        this.writeLine();
        
        // Emit TLD statements
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
                        this.writePunctuation(";");
                        this.writeLine();
                    }
                }
            } else {
                this.emit(stmt);
                this.writeLine();
            }
        }
        
        this.decreaseIndent();
        this.write("}");
        this.writeLine();
        this.writeLine();
        
        // Emit declarations at module level with 'export' keyword
        for (const decl of declarations) {
            if (ts.isFunctionDeclaration(decl)) {
                if (this.isExported(decl)) {
                    this.writeKeyword("export");
                    this.writeSpace();
                }
                this.emitFunctionDeclaration(decl);
                this.writeLine();
            } else if (ts.isClassDeclaration(decl)) {
                if (this.isExported(decl)) {
                    this.writeKeyword("export");
                    this.writeSpace();
                }
                this.emitClassDeclaration(decl);
                this.writeLine();
            } else if (ts.isEnumDeclaration(decl) || ts.isInterfaceDeclaration(decl)) {
                if (this.isExported(decl)) {
                    this.writeKeyword("export");
                    this.writeSpace();
                }
                this.emit(decl);
                this.writeLine();
            } else {
                this.emit(decl);
                this.writeLine();
            }
        }
        
        // Emit variable declarations with complex initializers (types only)
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
                                        typeStr = "Value";
                                    }
                                } else {
                                    typeStr = "Value";
                                }
                            } catch {
                                typeStr = "Value";
                            }
                        } else {
                            typeStr = "Value";
                        }
                        this.writeKeyword("export");
                        this.writeSpace();
                        this.write(typeStr);
                        this.writeSpace();
                        this.emit(decl.name);
                        this.writePunctuation(";");
                        this.writeLine();
                    }
                }
            }
        }
        
        // Close namespace
        this.decreaseIndent();
        this.writePunctuation("}");
        this.writeLine();
    }
    
    // Emit forward declaration for a function (for hoisting support)
    private emitForwardDeclaration(node: ts.FunctionDeclaration): void {
        if (!node.name) return;
        
        const funcName = this.getTextOfNode(node.name);
        const isExported = this.isExported(node);
        const returnType = node.type ? this.typeToString(node.type) : "void";
        
        // Handle template functions
        if (node.typeParameters && node.typeParameters.length > 0) {
            this.writeKeyword("template");
            this.writePunctuation("<");
            for (let i = 0; i < node.typeParameters.length; i++) {
                const tp = node.typeParameters[i];
                this.writeKeyword("typename");
                this.writeSpace();
                this.emit(tp.name);
                if (i < node.typeParameters.length - 1) {
                    this.writePunctuation(",");
                    this.writeSpace();
                }
            }
            this.writePunctuation(">");
            this.writeLine();
        }
        
        // Add export if the function is exported
        if (isExported) {
            this.writeKeyword("export");
            this.writeSpace();
        }
        
        this.write(returnType);
        this.writeSpace();
        this.write(funcName);
        this.writePunctuation("(");
        this.emitParamsList(node.parameters);
        this.writePunctuation(");");
        this.writeLine();
    }
}
