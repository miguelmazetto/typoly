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
    IfStatement,
    ForInStatement,
    ForOfStatement,
    TryStatement,
    ExpressionStatement,
    JsxElement,
    JsxSelfClosingElement,
    JsxFragment,
} from "typescript";
import { ExpressionsMixin } from './expressions';

// Map TypeScript typeof results to C++ types
const TYPEOF_MAP: Record<string, string> = {
    "string": "String",
    "number": "double",
    "boolean": "bool",
    "object": "Value",
    "function": "Function",
    "undefined": "Value",
};

export class StatementsMixin extends ExpressionsMixin {
    // Track narrowed variable types within conditional blocks
    protected narrowedTypes: Map<string, string> = new Map();
    
    // Check if an expression is a typeof check pattern
    private isTypeofCheck(node: ts.Expression): { variable: string, type: string, isPositive: boolean } | null {
        if (!ts.isBinaryExpression(node)) return null;
        
        const op = node.operatorToken.kind;
        const isPositive = op === ts.SyntaxKind.EqualsEqualsEqualsToken || 
                          op === ts.SyntaxKind.EqualsEqualsToken;
        const isNegative = op === ts.SyntaxKind.ExclamationEqualsEqualsToken || 
                          op === ts.SyntaxKind.ExclamationEqualsToken;
        
        if (!isPositive && !isNegative) return null;
        
        // Check if left is typeof expression
        if (ts.isTypeOfExpression(node.left) && ts.isStringLiteral(node.right)) {
            const typeArg = node.left.expression;
            if (ts.isIdentifier(typeArg)) {
                const typeStr = node.right.text;
                const cppType = TYPEOF_MAP[typeStr];
                if (cppType) {
                    return { variable: typeArg.text, type: cppType, isPositive };
                }
            }
        }
        
        // Check if right is typeof expression
        if (ts.isTypeOfExpression(node.right) && ts.isStringLiteral(node.left)) {
            const typeArg = node.right.expression;
            if (ts.isIdentifier(typeArg)) {
                const typeStr = node.left.text;
                const cppType = TYPEOF_MAP[typeStr];
                if (cppType) {
                    return { variable: typeArg.text, type: cppType, isPositive };
                }
            }
        }
        
        return null;
    }
    
    emitVariableDeclarationList(node: ts.VariableDeclarationList): void {
        for (let i = 0; i < node.declarations.length; i++) {
            const decl = node.declarations[i];
            if (i > 0) {
                this.writePunctuation(",");
                this.writeSpace();
            }
            
            if (decl.type) {
                this.write(this.typeToString(decl.type));
            } else if (this.typeChecker) {
                try {
                    const type = this.typeChecker.getTypeAtLocation(decl);
                    if (type && !(type.flags & ts.TypeFlags.Any)) {
                        const typeStr = this.typeChecker.typeToString(type, decl);
                        if (typeStr !== "any") {
                            this.write(this.mapInferredType(typeStr));
                        } else {
                            this.writeKeyword("auto");
                        }
                    } else {
                        this.writeKeyword("auto");
                    }
                } catch {
                    this.writeKeyword("auto");
                }
            } else {
                this.writeKeyword("auto");
            }
            
            this.writeSpace();
            this.emit(decl.name);
            
            if (decl.initializer) {
                this.writeSpace();
                this.writeOperator("=");
                this.writeSpace();
                this.emit(decl.initializer);
            }
        }
    }
    
    emitIfStatement(node: IfStatement): void {
        const typeofCheck = this.isTypeofCheck(node.expression);
        
        if (typeofCheck && this.typeChecker) {
            try {
                let idNode: ts.Identifier | undefined;
                const walk = (n: ts.Node): boolean => {
                    if (ts.isIdentifier(n) && n.text === typeofCheck.variable) {
                        idNode = n;
                        return true;
                    }
                    return n.forEachChild(walk) || false;
                };
                node.getSourceFile().forEachChild(walk);
                
                if (idNode) {
                    const symbol = this.typeChecker.getSymbolAtLocation(idNode);
                    if (symbol) {
                        const type = this.typeChecker.getTypeOfSymbolAtLocation(symbol, node);
                        const typeStr = this.typeChecker.typeToString(type);
                        if (typeStr.includes("|") || typeStr.startsWith("Union")) {
                            this.writeKeyword("if");
                            this.writeSpace();
                            this.writePunctuation("(");
                            this.write(typeofCheck.variable);
                            this.writePunctuation(".");
                            this.write("holds<");
                            this.write(typeofCheck.type);
                            this.write(">()");
                            this.writePunctuation(")");
                        } else {
                            this.writeKeyword("if");
                            this.writeSpace();
                            this.writePunctuation("(");
                            this.write("true");
                            this.writePunctuation(")");
                        }
                    } else {
                        this.writeKeyword("if (true)");
                    }
                } else {
                    this.writeKeyword("if (true)");
                }
            } catch {
                this.writeKeyword("if (true)");
            }
        } else if (typeofCheck) {
            this.writeKeyword("if (true)");
        } else {
            this.writeKeyword("if");
            this.writeSpace();
            this.writePunctuation("(");
            this.emitExpression(node.expression);
            this.writePunctuation(")");
        }
        
        const savedNarrowed = new Map(this.narrowedTypes);
        if (typeofCheck && typeofCheck.isPositive) {
            this.narrowedTypes.set(typeofCheck.variable, typeofCheck.type);
        }
        
        this.emitEmbeddedStatement(node, node.thenStatement);
        this.narrowedTypes = savedNarrowed;
        
        if (node.elseStatement) {
            this.writeLineOrSpace(node, node.thenStatement, node.elseStatement);
            this.writeKeyword("else");
            
            const savedElseNarrowed = new Map(this.narrowedTypes);
            if (typeofCheck && !typeofCheck.isPositive) {
                this.narrowedTypes.set(typeofCheck.variable, typeofCheck.type);
            }
            
            this.emitEmbeddedStatement(node, node.elseStatement);
            this.narrowedTypes = savedElseNarrowed;
        }
    }

    emitForInStatement(node: ForInStatement): void {
        this.writeKeyword("for");
        this.writeSpace();
        this.writePunctuation("(");
        if (ts.isVariableDeclarationList(node.initializer)) {
            const decl = node.initializer.declarations[0];
            const varName = this.getTextOfNode(decl.name);
            this.write("auto");
            this.writeSpace();
            this.write(varName);
        } else {
            this.emit(node.initializer);
        }
        this.writeSpace();
        this.writePunctuation(":");
        this.writeSpace();
        this.emitExpression(node.expression);
        this.writePunctuation(")");
        this.emitEmbeddedStatement(node, node.statement);
    }

    emitForOfStatement(node: ForOfStatement): void {
        this.writeKeyword("for");
        this.writeSpace();
        this.writePunctuation("(");
        if (ts.isVariableDeclarationList(node.initializer)) {
            const decl = node.initializer.declarations[0];
            const varName = this.getTextOfNode(decl.name);
            this.write("auto");
            this.writeSpace();
            this.write(varName);
        } else {
            this.emit(node.initializer);
        }
        this.writeSpace();
        this.writePunctuation(":");
        this.writeSpace();
        this.emitExpression(node.expression);
        this.writePunctuation(")");
        this.emitEmbeddedStatement(node, node.statement);
    }

    emitTryStatement(node: TryStatement): void {
        this.writeKeyword("try");
        this.writeSpace();
        this.emit(node.tryBlock);
        if (node.catchClause) {
            this.writeLineOrSpace(node, node.tryBlock, node.catchClause);
            this.writeKeyword("catch");
            if (node.catchClause.variableDeclaration) {
                this.writeSpace();
                this.writePunctuation("(");
                const param = node.catchClause.variableDeclaration;
                const paramType = param.type ? this.typeToString(param.type) : "std::exception";
                this.write(paramType);
                this.writeSpace();
                this.emit(param.name);
                this.writePunctuation(")");
            }
            this.writeSpace();
            this.emit(node.catchClause.block);
        }
        if (node.finallyBlock) {
            this.writeLineOrSpace(node, node.catchClause || node.tryBlock, node.finallyBlock);
            this.writeComment("// finally block - not directly supported in C++");
            this.writeLine();
            this.emit(node.finallyBlock);
        }
    }

    emitExpressionStatement(node: ExpressionStatement): void {
        this.emitExpression(node.expression);
        this.writePunctuation(";");
    }

    emitJsxElement(node: JsxElement): void {
        this.writeComment("// JSX element not supported in C++");
        this.writeLine();
    }

    emitJsxSelfClosingElement(node: JsxSelfClosingElement): void {
        this.writeComment("// JSX self-closing element not supported in C++");
        this.writeLine();
    }

    emitJsxFragment(node: JsxFragment): void {
        this.writeComment("// JSX fragment not supported in C++");
        this.writeLine();
    }
}
