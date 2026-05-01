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
    BinaryExpression,
    PropertyAccessExpression,
    CallExpression,
    NewExpression,
    AwaitExpression,
    YieldExpression,
    TaggedTemplateExpression,
    ArrowFunction,
    FunctionExpression,
} from "typescript";
import { DeclarationsMixin } from './declarations';

export class ExpressionsMixin extends DeclarationsMixin {
    emitBinaryExpression(node: BinaryExpression): void {
        const operator = node.operatorToken.kind;
        let cppOperator: string;
        
        switch (operator) {
            case ts.SyntaxKind.EqualsEqualsEqualsToken:
            case ts.SyntaxKind.EqualsEqualsToken:
                cppOperator = "==";
                break;
            case ts.SyntaxKind.ExclamationEqualsEqualsToken:
            case ts.SyntaxKind.ExclamationEqualsToken:
                cppOperator = "!=";
                break;
            case ts.SyntaxKind.AmpersandAmpersandToken:
                cppOperator = "&&";
                break;
            case ts.SyntaxKind.BarBarToken:
                cppOperator = "||";
                break;
            case ts.SyntaxKind.PlusToken:
                this.emitExpression(node.left);
                this.writeSpace();
                this.writeOperator("+");
                this.writeSpace();
                this.emitExpression(node.right);
                return;
            case ts.SyntaxKind.MinusToken:
                cppOperator = "-";
                break;
            case ts.SyntaxKind.AsteriskToken:
                cppOperator = "*";
                break;
            case ts.SyntaxKind.SlashToken:
                cppOperator = "/";
                break;
            case ts.SyntaxKind.PercentToken:
                cppOperator = "%";
                break;
            case ts.SyntaxKind.LessThanToken:
                cppOperator = "<";
                break;
            case ts.SyntaxKind.LessThanEqualsToken:
                cppOperator = "<=";
                break;
            case ts.SyntaxKind.GreaterThanToken:
                cppOperator = ">";
                break;
            case ts.SyntaxKind.GreaterThanEqualsToken:
                cppOperator = ">=";
                break;
            case ts.SyntaxKind.QuestionQuestionToken:
                this.emitNullishCoalescing(node);
                return;
            case ts.SyntaxKind.PlusEqualsToken:
                cppOperator = "+=";
                break;
            case ts.SyntaxKind.MinusEqualsToken:
                cppOperator = "-=";
                break;
            case ts.SyntaxKind.AsteriskEqualsToken:
                cppOperator = "*=";
                break;
            case ts.SyntaxKind.SlashEqualsToken:
                cppOperator = "/=";
                break;
            default:
                cppOperator = this.getOperatorText(operator);
        }
        
        this.emitExpression(node.left);
        this.writeSpace();
        this.writeOperator(cppOperator);
        this.writeSpace();
        this.emitExpression(node.right);
    }

    private emitNullishCoalescing(node: BinaryExpression): void {
        this.writePunctuation("(");
        this.emitExpression(node.left);
        this.writeSpace();
        this.writeOperator("!=");
        this.writeSpace();
        this.writeKeyword("nullptr");
        this.writeSpace();
        this.writePunctuation("?");
        this.writeSpace();
        this.emitExpression(node.left);
        this.writeSpace();
        this.writePunctuation(":");
        this.writeSpace();
        this.emitExpression(node.right);
        this.writePunctuation(")");
    }

    emitPropertyAccessExpression(node: PropertyAccessExpression): void {
        if (node.expression.kind === ts.SyntaxKind.SuperKeyword) {
            const baseClassName = this.getBaseClassName(node);
            if (baseClassName) {
                this.write(baseClassName);
                this.writePunctuation("::");
                this.emit(node.name);
            } else {
                this.writeComment("// super access not supported");
            }
            return;
        }

        const importedModule = this.getImportedModuleName(node.expression);
        if (importedModule) {
            this.write(importedModule);
            this.writePunctuation("::");
            this.emit(node.name);
            return;
        }
        
        if (ts.isIdentifier(node.expression)) {
            const objName = node.expression.text;
            const globalNamespaces = ["Math", "JSON", "Date", "RegExp", "process", "path", "fs", "os"];
            if (globalNamespaces.includes(objName)) {
                this.write(objName);
                this.writePunctuation("::");
                this.emit(node.name);
                return;
            }
        }

        // Check if accessing a property on 'this' - use -> instead of .
        if (node.expression.kind === ts.SyntaxKind.ThisKeyword) {
            this.write("this");
            this.writePunctuation("->");
            this.emit(node.name);
            return;
        }
        
        // Properties that should become method calls (for String, Vector, etc.)
        const propertyName = ts.isIdentifier(node.name) ? node.name.text : "";
        const methodProperties = ["length", "size"];
        
        if (methodProperties.includes(propertyName)) {
            this.emitExpression(node.expression);
            this.writePunctuation(".");
            this.emit(node.name);
            this.writePunctuation("(");
            this.writePunctuation(")");
            return;
        }

        this.emitExpression(node.expression);
        this.writePunctuation(".");
        this.emit(node.name);
    }

    emitCallExpression(node: CallExpression): void {
        if (ts.isPropertyAccessExpression(node.expression)) {
            const propExpr = node.expression;
            const importedModule = this.getImportedModuleName(propExpr.expression);
            const methodName = ts.isIdentifier(propExpr.name) ? propExpr.name.text : '';
            
            if (importedModule) {
                const fullFunctionName = `${importedModule}.${methodName}`;
                const override = this.resolveFunctionOverride(fullFunctionName, node.arguments);
                
                if (override) {
                    this.write(importedModule);
                    this.writePunctuation("::");
                    this.write(override.cppFunction);
                    this.emitArguments(node.arguments);
                    return;
                }
                
                this.write(importedModule);
                this.writePunctuation("::");
                this.emit(propExpr.name);
                this.emitArguments(node.arguments);
                return;
            }
            
            if (ts.isIdentifier(propExpr.expression)) {
                const objName = propExpr.expression.text;
                if (objName === "console") {
                    this.write("console");
                    this.writePunctuation("::");
                    this.emit(propExpr.name);
                    this.emitArguments(node.arguments);
                    return;
                }
                const globalObjects = ["Math", "JSON", "Date", "RegExp", "process", "path", "fs", "os"];
                if (globalObjects.includes(objName)) {
                    const fullFunctionName = `${objName}.${methodName}`;
                    const override = this.resolveFunctionOverride(fullFunctionName, node.arguments);
                    
                    if (override) {
                        this.write(objName);
                        this.writePunctuation("::");
                        this.write(override.cppFunction);
                        this.emitArguments(node.arguments);
                        return;
                    }
                    
                    this.write(objName);
                    this.writePunctuation("::");
                    this.emit(propExpr.name);
                    this.emitArguments(node.arguments);
                    return;
                }
            }
        }
        
        if (ts.isIdentifier(node.expression)) {
            const funcName = node.expression.text;
            if (this.namedImports && this.namedImports.has(funcName)) {
                const moduleNs = this.namedImports.get(funcName) || "";
                this.write(moduleNs);
                this.writePunctuation("::");
                this.write(funcName);
                this.emitArguments(node.arguments);
                return;
            }
        }

        if (node.expression.kind === ts.SyntaxKind.SuperKeyword) {
            this.writeComment("// Base class constructor call");
            return;
        }

        super.emitCallExpression(node);
    }

    protected emitArguments(args: ts.NodeArray<ts.Expression>): void {
        this.writePunctuation("(");
        for (let i = 0; i < args.length; i++) {
            const arg = args[i];
            if (ts.isStringLiteral(arg)) {
                this.write(this.escapeStringForCpp(arg.text));
            } else {
                this.emitExpression(arg);
            }
            if (i < args.length - 1) {
                this.writePunctuation(",");
                this.writeSpace();
            }
        }
        this.writePunctuation(")");
    }

    emitNewExpression(node: NewExpression): void {
        // Don't emit 'new' - in C++ we use value semantics
        this.emitExpression(node.expression);
        if (node.arguments && node.arguments.length) {
            this.writePunctuation("(");
            for (let i = 0; i < node.arguments.length; i++) {
                this.emitExpression(node.arguments[i]);
                if (i < node.arguments.length - 1) {
                    this.writePunctuation(",");
                    this.writeSpace();
                }
            }
            this.writePunctuation(")");
        } else {
            this.writePunctuation("(");
            this.writePunctuation(")");
        }
    }

    emitAwaitExpression(node: AwaitExpression): void {
        this.writeKeyword("co_await");
        this.writeSpace();
        this.emitExpression(node.expression);
    }

    emitYieldExpression(node: YieldExpression): void {
        this.writeComment("// C++ does not support yield");
        if (node.expression) {
            this.writeComment(" // would yield ");
            this.emitExpression(node.expression);
        }
    }

    emitTaggedTemplateExpression(node: TaggedTemplateExpression): void {
        this.writeComment("// Tagged template literal not supported in C++");
        this.writeLine();
        this.writeKeyword("static_assert");
        this.writePunctuation("(");
        this.writeLiteral("false");
        this.writePunctuation(",");
        this.writeSpace();
        this.writeStringLiteral("Tagged template literals not implemented");
        this.writePunctuation(")");
        this.writePunctuation(";");
    }

    emitArrowFunction(node: ArrowFunction): void {
        this.writePunctuation("[");
        this.writePunctuation("]");
        this.writePunctuation("(");
        this.emitParamsList(node.parameters);
        this.writePunctuation(")");
        if (node.type) {
            this.writeSpace();
            this.writeOperator("->");
            this.writeSpace();
            this.emit(node.type);
        }
        this.writeSpace();
        if (ts.isBlock(node.body)) {
            this.emitBlock(node.body);
        } else {
            this.writePunctuation("{");
            this.writeSpace();
            this.writeKeyword("return");
            this.writeSpace();
            this.emitExpression(node.body);
            this.writePunctuation(";");
            this.writeSpace();
            this.writePunctuation("}");
        }
    }

    emitFunctionExpression(node: FunctionExpression): void {
        this.writePunctuation("[");
        this.writePunctuation("]");
        this.writePunctuation("(");
        this.emitParamsList(node.parameters);
        this.writePunctuation(")");
        if (node.type) {
            this.writeSpace();
            this.writeOperator("->");
            this.writeSpace();
            this.emit(node.type);
        }
        this.writeSpace();
        this.emitBlock(node.body);
    }

    emitArrayLiteralExpression(node: ts.ArrayLiteralExpression): void {
        this.write("Vector<");
        if (node.elements.length > 0) {
            const firstElem = node.elements[0];
            if (ts.isNumericLiteral(firstElem)) {
                this.write("double");
            } else if (ts.isStringLiteral(firstElem)) {
                this.write("String");
            } else if (ts.isBooleanLiteral(firstElem)) {
                this.write("bool");
            } else {
                this.write("Value");
            }
        } else {
            this.write("Value");
        }
        this.writePunctuation(">");
        this.writeSpace();
        this.writePunctuation("{");
        for (let i = 0; i < node.elements.length; i++) {
            this.emitExpression(node.elements[i]);
            if (i < node.elements.length - 1) {
                this.writePunctuation(",");
                this.writeSpace();
            }
        }
        this.writePunctuation("}");
    }

    emitObjectLiteralExpression(node: ts.ObjectLiteralExpression): void {
        this.write("Object");
        this.writePunctuation("(");
        this.writePunctuation("{");
        for (let i = 0; i < node.properties.length; i++) {
            const prop = node.properties[i];
            if (ts.isPropertyAssignment(prop)) {
                if (ts.isIdentifier(prop.name) || ts.isStringLiteral(prop.name)) {
                    this.write(this.getTextOfNode(prop.name as any));
                }
                this.writePunctuation(":");
                this.writeSpace();
                this.emitExpression(prop.initializer);
                if (i < node.properties.length - 1) {
                    this.writePunctuation(",");
                    this.writeSpace();
                }
            }
        }
        this.writePunctuation("}");
        this.writePunctuation(")");
    }

    writeTokenNode(node: ts.Node, writer: (s: string) => void): void {
        const kind = node.kind;
        if (kind === ts.SyntaxKind.NullKeyword) {
            writer("nullptr");
            return;
        }
        if (kind === ts.SyntaxKind.UndefinedKeyword) {
            writer("nullptr");
            return;
        }
        if (kind === ts.SyntaxKind.ThisKeyword) {
            writer("this");
            return;
        }
        if (kind === ts.SyntaxKind.TrueKeyword) {
            writer("true");
            return;
        }
        if (kind === ts.SyntaxKind.FalseKeyword) {
            writer("false");
            return;
        }
        super.writeTokenNode(node, writer);
    }
}
