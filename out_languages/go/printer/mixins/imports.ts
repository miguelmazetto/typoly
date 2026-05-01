/* Copyright 2026 Miguel Ferreira Mazetto
*
*  Licensed under the Apache License, Version 2.0 (the "License");
*  you may not use this file except in compliance with the License.
*  You may obtain a copy of the License at
*
*      http://www.apache.org/licenses/LICENSE-2.0
*
*  Unless required by applicable law or agreed to in writing, software
*  distributed under the License is distributed on an "AS IS" BASIS,
*  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
*  See the License for the specific language governing permissions and
*  limitations under the License.
*/
import * as ts from 'typescript';
import type {
    ImportDeclaration,
    ExportDeclaration,
    SourceFile,
    Identifier,
} from "typescript";
import { StatementsMixin } from './statements';

const NODE_CORE_MODULES: Record<string, string> = {
    'fs': 'test_package/stdlib/fs',
    'path': 'path',
    'os': 'os',
    'regexp': 'test_package/stdlib',
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

export class ImportsMixin extends StatementsMixin {
    private usedPackages: Set<string> = new Set();
    private importedModuleNames: string[] = [];
    private needsFmt: boolean = false;
    private needsTypoly: boolean = false;
    private needsMath: boolean = false;
    private needsStrings: boolean = false;
    private exportedNames: Set<string> = new Set();
    private namedImportMap: Map<string, string> = new Map();

    override getNamedImport(name: string): string | undefined {
        return this.namedImportMap.get(name);
    }

    trackExportedName(name: string): void {
        this.exportedNames.add(name);
    }

    isExportedName(name: string): boolean {
        return this.exportedNames.has(name);
    }

    clearExportedNames(): void {
        this.exportedNames.clear();
    }

    private preScanAST(sourceFile: ts.SourceFile): void {
        const visit = (node: ts.Node) => {
            if (ts.isNewExpression(node) && ts.isIdentifier(node.expression) && node.expression.text === "RegExp") {
                this.importedPackages.add("test_package/stdlib");
                this.needsTypoly = true;
            }
            if (ts.isPropertyAccessExpression(node) && ts.isIdentifier(node.expression) && node.expression.text === "Math") {
                this.needsMath = true;
            }
            if (ts.isPropertyAccessExpression(node) && ts.isStringLiteral(node.expression)) {
                const methodName = node.name.text;
                const stringMethods = ["includes", "toLowerCase", "toUpperCase", "replace", "replaceAll",
                                      "indexOf", "lastIndexOf", "startsWith", "endsWith", "trim", "trimStart", "trimEnd", "split"];
                if (stringMethods.includes(methodName)) {
                    this.needsStrings = true;
                }
            }
            node.forEachChild(visit);
        };
        sourceFile.forEachChild(visit);
    }

    emitImportDeclaration(node: ImportDeclaration): void {
        const moduleSpecifier = node.moduleSpecifier;
        if (moduleSpecifier.kind !== ts.SyntaxKind.StringLiteral) {
            return;
        }

        const moduleName = (moduleSpecifier as any).text;
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

        const importPath = this.computeImportPath(moduleName);
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
                for (const spec of (bindings as any).elements) {
                    const localName = (spec.name as Identifier).escapedText.toString();
                    const importedName = spec.propertyName ? (spec.propertyName as Identifier).escapedText.toString() : localName;
                    this.namedImportMap.set(localName, pkgName + "." + importedName.charAt(0).toUpperCase() + importedName.slice(1));
                }
            }
        } else if (importClause.name) {
            this.usedPackages.add(importPath);
        }
    }

    emitExportDeclaration(node: ExportDeclaration): void {
    }

    getImportedPackageForFunction(funcName: string): string | null {
        for (const [alias, path] of this.namespaceImports) {
            if (funcName.startsWith(alias)) {
                const parts = path.split("/");
                return parts[parts.length - 1];
            }
        }
        if (funcName.startsWith("test")) {
            for (const pkg of this.importedModuleNames) {
                const expectedFunc = "Test" + pkg.charAt(0).toUpperCase() + pkg.slice(1);
                if (funcName.toLowerCase() === expectedFunc.toLowerCase() ||
                    funcName === "Test" + pkg.charAt(0).toUpperCase() + pkg.slice(1)) {
                    return pkg;
                }
            }
            const suffix = funcName.slice(4);
            for (const pkg of this.importedModuleNames) {
                if (pkg.includes(suffix.toLowerCase())) {
                    return pkg;
                }
            }
        }
        return null;
    }

    emitSourceFile(node: SourceFile): void {
        this.importedModuleNames = [];
        this.usedPackages = new Set();
        this.needsFmt = false;
        this.needsTypoly = false;
        this.needsMath = false;
        this.needsStrings = false;
        this.clearInterfaceVars();
        this.clearExportedNames();

        this.currentPackagePath = this.computePackageName(node.fileName);
        this.preScanAST(node);

        for (const stmt of node.statements) {
            if (this.containsConsoleLog(stmt)) {
                this.needsFmt = true;
                break;
            }
        }

        this.write("package ");
        this.write(this.currentPackagePath);
        this.writeLine();
        this.writeLine();

        for (const stmt of node.statements) {
            if (stmt.kind === ts.SyntaxKind.ImportDeclaration) {
                this.emit(stmt);
            }
        }

        if (this.importedPackages.size > 0 || this.usedPackages.size > 0 || this.needsFmt || this.needsTypoly || this.needsMath || this.needsStrings) {
            this.write("import (");
            this.writeLine();
            this.increaseIndent();

            if (this.needsTypoly) {
                this.write("\"test_package/stdlib\"");
                this.writeLine();
            }
            if (this.needsMath) {
                this.write("\"math\"");
                this.writeLine();
            }
            if (this.needsStrings) {
                this.write("\"strings\"");
                this.writeLine();
            }
            for (const pkg of this.importedPackages) {
                if (pkg !== "test_package/stdlib") {
                    this.write("\"");
                    this.write(pkg);
                    this.write("\"");
                    this.writeLine();
                }
            }
            if (this.needsFmt) {
                this.write("\"fmt\"");
                this.writeLine();
            }
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

        const declarations: ts.Statement[] = [];
        const constStatements: ts.VariableStatement[] = [];
        const tldStatements: ts.Statement[] = [];

        for (const stmt of node.statements) {
            if (stmt.kind === ts.SyntaxKind.ImportDeclaration ||
                stmt.kind === ts.SyntaxKind.ImportEqualsDeclaration) {
                continue;
            }

            if (ts.isVariableStatement(stmt)) {
                const isConst = !!(stmt.declarationList.flags & ts.NodeFlags.Const);
                const hasInitializer = stmt.declarationList.declarations.some((d: ts.VariableDeclaration) => d.initializer);
                if (isConst && hasInitializer) {
                    constStatements.push(stmt);
                } else if (hasInitializer) {
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

        for (const decl of declarations) {
            this.emit(decl);
        }

        for (const cs of constStatements) {
            this.emit(cs);
        }

        this.write("var TldInitialized bool = false");
        this.writeLine();
        this.writeLine();

        this.write("func Tld() {");
        this.writeLine();
        this.increaseIndent();

        for (const importedPkg of this.importedModuleNames) {
            this.write("if !");
            this.write(importedPkg);
            this.write(".TldInitialized {");
            this.writeLine();
            this.increaseIndent();
            this.write(importedPkg);
            this.write(".Tld()");
            this.writeLine();
            this.write(importedPkg);
            this.write(".TldInitialized = true");
            this.writeLine();
            this.decreaseIndent();
            this.writePunctuation("}");
            this.writeLine();
        }

        for (const stmt of tldStatements) {
            if (ts.isVariableStatement(stmt)) {
                for (const decl of stmt.declarationList.declarations) {
                    if (decl.initializer) {
                        const name = this.getTextOfNode(decl.name);
                        this.write(name);
                        this.write(" = ");
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
