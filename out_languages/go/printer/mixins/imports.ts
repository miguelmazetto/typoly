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
    'fs': 'test_package/stdlib/fs',
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
        private needsFmt: boolean = false;
        
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
            // Use the last part of the import path as the package name
            const pathParts = importPath.split("/");
            const pkgName = pathParts[pathParts.length - 1];
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
            this.needsFmt = false;
            
            this.currentPackagePath = this.computePackageName(node.fileName);
            
            // First pass: check if we need fmt (for console.log)
            for (const stmt of node.statements) {
                if (this.containsConsoleLog(stmt)) {
                    this.needsFmt = true;
                    break;
                }
            }
            
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
            if (this.importedPackages.size > 0 || this.usedPackages.size > 0 || this.needsFmt) {
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
                
                // Add fmt if needed
                if (this.needsFmt) {
                    this.write("\"fmt\"");
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
            const tldStatements: ts.Statement[] = [];
            
            for (const stmt of node.statements) {
                if (stmt.kind === ts.SyntaxKind.ImportDeclaration || 
                    stmt.kind === ts.SyntaxKind.ImportEqualsDeclaration) {
                    continue;
                }
                
                if (ts.isVariableStatement(stmt)) {
                    const hasInitializer = stmt.declarationList.declarations.some(d => d.initializer);
                    if (hasInitializer) {
                        // All variables with initializers go to TLD
                        tldStatements.push(stmt);
                    } else {
                        declarations.push(stmt);
                    }
                } else if (ts.isFunctionDeclaration(stmt) || 
                           ts.isClassDeclaration(stmt) || 
                           ts.isInterfaceDeclaration(stmt) ||
                           ts.isEnumDeclaration(stmt) ||
                           ts.isTypeAliasDeclaration(stmt)) {
                    declarations.push(stmt);
                } else {
                    tldStatements.push(stmt);
                }
            }
            
            // Emit declarations at package level (no forward declarations needed in Go)
            for (const decl of declarations) {
                this.emit(decl);
            }
            
            // Always emit __tldInitialized flag
            this.write("var __tldInitialized bool = false");
            this.writeLine();
            this.writeLine();
            
            // Always emit __tld() function
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
                            // Use := for local variable declaration with initialization
                            const name = this.getTextOfNode(decl.name);
                            this.write(name);
                            this.write(" := ");
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
        
        // Check if a statement contains console.log
        private containsConsoleLog(stmt: ts.Statement): boolean {
            let found = false;
            const visit = (n: ts.Node) => {
                if (ts.isPropertyAccessExpression(n) && 
                    ts.isIdentifier(n.expression) && 
                    n.expression.text === "console") {
                    found = true;
                    return;
                }
                n.forEachChild(visit);
            };
            visit(stmt);
            return found;
        }
    }
    
    return ImportsMixin;
}
