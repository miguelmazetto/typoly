import * as ts from 'typescript';
import type {
    ImportDeclaration,
    ExportDeclaration,
    SourceFile,
    Identifier,
} from "typescript";

export function ImportsMixin<TBase extends new (...args: any[]) => any>(Base: TBase) {
    class ImportsMixin extends Base {
        private usedPackages: Set<string> = new Set();
        private importedModuleNames: string[] = [];
        
        emitImportDeclaration(node: ImportDeclaration): void {
            const moduleSpecifier = node.moduleSpecifier;
            if (moduleSpecifier.kind !== ts.SyntaxKind.StringLiteral) {
                return;
            }
            
            const moduleName = (moduleSpecifier as any).text;
            const importPath = this.computeImportPath(moduleName);
            
            // Track imported module for Tld() calls
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
            const declarationStatements: ts.Statement[] = [];
            const tldStatements: ts.Statement[] = [];
            
            for (const stmt of node.statements) {
                if (stmt.kind === ts.SyntaxKind.ImportDeclaration || 
                    stmt.kind === ts.SyntaxKind.ImportEqualsDeclaration) {
                    continue;
                }
                
                if (ts.isVariableStatement(stmt)) {
                    declarations.push(stmt);
                    const hasInitializer = stmt.declarationList.declarations.some(d => d.initializer);
                    if (hasInitializer) {
                        tldStatements.push(stmt);
                    }
                } else if (ts.isFunctionDeclaration(stmt) || 
                           ts.isClassDeclaration(stmt) || 
                           ts.isInterfaceDeclaration(stmt) ||
                           ts.isEnumDeclaration(stmt) ||
                           ts.isTypeAliasDeclaration(stmt)) {
                    declarations.push(stmt);
                } else {
                    // Expression statements go into TLD
                    tldStatements.push(stmt);
                }
            }
            
            // Always emit __tld_initialized flag (use __tldInitialized for Go)
            this.write("var __tldInitialized bool = false");
            this.writeLine();
            this.writeLine();
            
            // Emit declarations at package level
            for (const decl of declarations) {
                if (!tldStatements.includes(decl)) {
                    this.emit(decl);
                }
            }
            
            // Emit declarations for variables with initializers (without the initializer)
            for (const stmt of tldStatements) {
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
            
            // Always emit __tld() function (use __tld for Go - it will be called from main)
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
    }
    
    return ImportsMixin;
}
