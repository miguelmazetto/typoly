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
    ConditionalExpression,
    ElementAccessExpression,
    NonNullExpression,
    PrefixUnaryExpression,
    PostfixUnaryExpression,
    ArrowFunction,
    FunctionExpression,
} from "typescript";
import { DeclarationsMixin } from './declarations';

export class ExpressionsMixin extends DeclarationsMixin {
    private interfaceVars: Set<string> = new Set();
    private valueVars: Set<string> = new Set();

    trackValueVar(name: string): void {
        this.valueVars.add(name);
    }

    override trackInterfaceVar(name: string): void {
        this.interfaceVars.add(name);
    }

    override isInterfaceVarAccess(expr: ts.Expression): boolean {
        if (ts.isIdentifier(expr)) {
            return this.interfaceVars.has(expr.text);
        }
        if (ts.isPropertyAccessExpression(expr)) {
            return this.isInterfaceVarAccess(expr.expression);
        }
        return false;
    }

    clearInterfaceVars(): void {
        this.interfaceVars.clear();
        this.valueVars.clear();
    }

    private isTypeofComparison(node: ts.Expression): boolean {
        if (!ts.isBinaryExpression(node)) return false;
        const bin = node;
        const isEq = bin.operatorToken.kind === ts.SyntaxKind.EqualsEqualsEqualsToken ||
                     bin.operatorToken.kind === ts.SyntaxKind.EqualsEqualsToken ||
                     bin.operatorToken.kind === ts.SyntaxKind.ExclamationEqualsEqualsToken ||
                     bin.operatorToken.kind === ts.SyntaxKind.ExclamationEqualsToken;
        const isTypeof = ts.isTypeOfExpression(bin.left) && ts.isStringLiteral(bin.right);
        return isEq && isTypeof;
    }

    emitBinaryExpression(node: BinaryExpression): void {
        const operator = node.operatorToken.kind;

        if (this.isTypeofComparison(node)) {
            this.write("true");
            return;
        }

        if (operator === ts.SyntaxKind.AmpersandAmpersandToken) {
            if (this.isTypeofComparison(node.left) && this.isTypeofComparison(node.right)) {
                this.write("true");
                return;
            }
            if (this.isTypeofComparison(node.left)) {
                this.emitExpression(node.right);
                return;
            }
            if (this.isTypeofComparison(node.right)) {
                this.emitExpression(node.left);
                return;
            }
        }

        if (operator === ts.SyntaxKind.BarBarToken) {
            if (this.isTypeofComparison(node.left) || this.isTypeofComparison(node.right)) {
                this.write("true");
                return;
            }
        }

        let goOperator: string;

        switch (operator) {
            case ts.SyntaxKind.EqualsEqualsEqualsToken:
            case ts.SyntaxKind.EqualsEqualsToken:
                goOperator = "==";
                break;
            case ts.SyntaxKind.ExclamationEqualsEqualsToken:
            case ts.SyntaxKind.ExclamationEqualsToken:
                goOperator = "!=";
                break;
            case ts.SyntaxKind.AmpersandAmpersandToken:
                goOperator = "&&";
                break;
            case ts.SyntaxKind.BarBarToken:
                goOperator = "||";
                break;
            case ts.SyntaxKind.PlusToken:
                goOperator = "+";
                break;
            case ts.SyntaxKind.MinusToken:
                goOperator = "-";
                break;
            case ts.SyntaxKind.AsteriskToken:
                goOperator = "*";
                break;
            case ts.SyntaxKind.SlashToken:
                goOperator = "/";
                break;
            case ts.SyntaxKind.PercentToken:
                goOperator = "%";
                break;
            case ts.SyntaxKind.LessThanToken:
                goOperator = "<";
                break;
            case ts.SyntaxKind.LessThanEqualsToken:
                goOperator = "<=";
                break;
            case ts.SyntaxKind.GreaterThanToken:
                goOperator = ">";
                break;
            case ts.SyntaxKind.GreaterThanEqualsToken:
                goOperator = ">=";
                break;
            case ts.SyntaxKind.QuestionQuestionToken:
                this.emitNullishCoalescing(node);
                return;
            case ts.SyntaxKind.PlusEqualsToken:
                this.emitExpression(node.left);
                this.writeSpace();
                this.writeOperator("+=");
                this.writeSpace();
                this.emitExpression(node.right);
                return;
            case ts.SyntaxKind.MinusEqualsToken:
                this.emitExpression(node.left);
                this.writeSpace();
                this.writeOperator("-=");
                this.writeSpace();
                this.emitExpression(node.right);
                return;
            case ts.SyntaxKind.AsteriskEqualsToken:
                this.emitExpression(node.left);
                this.writeSpace();
                this.writeOperator("*=");
                this.writeSpace();
                this.emitExpression(node.right);
                return;
            case ts.SyntaxKind.SlashEqualsToken:
                this.emitExpression(node.left);
                this.writeSpace();
                this.writeOperator("/=");
                this.writeSpace();
                this.emitExpression(node.right);
                return;
            default:
                goOperator = "=";
        }

        this.emitExpression(node.left);
        this.writeSpace();
        this.writeOperator(goOperator);
        this.writeSpace();
        this.emitExpression(node.right);
    }

    private emitNullishCoalescing(node: BinaryExpression): void {
        this.write("func() interface{} { if ");
        this.emitExpression(node.left);
        this.write(" != nil { return ");
        this.emitExpression(node.left);
        this.write(" }; return ");
        this.emitExpression(node.right);
        this.write(" }()");
    }

    emitPropertyAccessExpression(node: PropertyAccessExpression): void {
        if (node.expression.kind === ts.SyntaxKind.SuperKeyword) {
            const baseClassName = this.getBaseClassName(node);
            if (baseClassName) {
                this.write(baseClassName);
                this.writePunctuation(".");
                this.write(this.toPascalCase(this.getTextOfNode(node.name)));
            } else {
                this.writeComment("// super access not supported");
            }
            return;
        }

        if (ts.isIdentifier(node.expression)) {
            const objName = node.expression.text;
            const propName = this.getTextOfNode(node.name);

            if (objName === "Math") {
                this.importedPackages.add("math");
                const mathConstMap: Record<string, string> = {
                    "PI": "math.Pi",
                    "E": "math.E",
                    "LN2": "math.Ln2",
                    "LN10": "math.Ln10",
                    "LOG2E": "math.Log2E",
                    "LOG10E": "math.Log10E",
                    "SQRT2": "math.Sqrt2",
                    "SQRT1_2": "math.Sqrt1_2",
                };
                if (mathConstMap[propName]) {
                    this.write(mathConstMap[propName]);
                    return;
                }
                this.write("math.");
                this.write(propName);
                return;
            }
        }

        const propName = ts.isIdentifier(node.name) ? node.name.text : '';
        if (propName === 'length' || propName === 'Length') {
            this.write("len(");
            this.emitExpression(node.expression);
            this.writePunctuation(")");
            return;
        }

        const importedModule = this.getImportedModuleName(node.expression);
        if (importedModule) {
            const pathParts = importedModule.split("/");
            const pkgName = pathParts[pathParts.length - 1];
            this.write(pkgName);
            this.writePunctuation(".");
            this.write(this.toPascalCase(this.getTextOfNode(node.name)));
            return;
        }

        if (ts.isIdentifier(node.expression)) {
            const objName = node.expression.text;
            const globalObjects = ["console", "Math", "JSON", "Date", "RegExp", "process", "path", "fs", "os"];
            if (globalObjects.includes(objName)) {
                this.write(objName);
                this.writePunctuation(".");
                this.write(this.toPascalCase(this.getTextOfNode(node.name)));
                return;
            }
            if (this.interfaceVars.has(objName)) {
                if (this.valueVars.has(objName)) {
                    if (propName === 'value' || propName === 'Value') {
                        this.write(objName);
                        return;
                    }
                    if (propName === 'groups' || propName === 'Groups') {
                        this.write("[]string{}");
                        return;
                    }
                }
                this.importedPackages.add("test_package/stdlib");
                this.write("(");
                this.write(objName);
                this.write(".(*typoly.MatchResult)");
                this.writePunctuation(")");
                this.writePunctuation(".");
                const goPropName = this.toPascalCase(propName);
                this.write(goPropName);
                return;
            }
        }

        this.emitExpression(node.expression);
        this.writePunctuation(".");
        this.write(this.toPascalCase(this.getTextOfNode(node.name)));
    }

    emitCallExpression(node: CallExpression): void {
        if (ts.isPropertyAccessExpression(node.expression)) {
            const propExpr = node.expression;
            const importedModule = this.getImportedModuleName(propExpr.expression);
            const methodName = ts.isIdentifier(propExpr.name) ? propExpr.name.text : '';

            if (importedModule) {
                const pathParts = importedModule.split("/");
                const pkgName = pathParts[pathParts.length - 1];

                const fullFunctionName = `${importedModule}.${methodName}`;
                const override = this.resolveFunctionOverride(fullFunctionName, node.arguments);

                if (override) {
                    this.write(pkgName);
                    this.writePunctuation(".");
                    this.write(override.cppFunction);
                    this.writePunctuation("(");
                    this.emitArguments(node.arguments);
                    this.writePunctuation(")");
                    return;
                }

                this.write(pkgName);
                this.writePunctuation(".");
                this.write(this.toPascalCase(methodName));
                this.writePunctuation("(");
                this.emitArguments(node.arguments);
                this.writePunctuation(")");
                return;
            }

            if (ts.isIdentifier(propExpr.expression) && propExpr.expression.text === "console") {
                this.emitConsoleCall(methodName, node.arguments);
                return;
            }

            if (ts.isIdentifier(propExpr.expression) && propExpr.expression.text === "Math") {
                this.emitMathCall(methodName, node.arguments);
                return;
            }

            if (ts.isStringLiteral(propExpr.expression)) {
                this.emitStringMethodCall(propExpr, node.arguments);
                return;
            }

            this.emitMethodCall(propExpr, node.arguments);
            return;
        }

        if (node.expression.kind === ts.SyntaxKind.SuperKeyword) {
            this.writeComment("// super call");
            return;
        }

        if (ts.isIdentifier(node.expression)) {
            const funcName = node.expression.text;
            const importedPkg = this.namespaceImports.get(funcName);
            if (importedPkg) {
                const pathParts = importedPkg.split("/");
                const pkgName = pathParts[pathParts.length - 1];
                this.write(pkgName);
                this.writePunctuation(".");
                this.write(funcName.charAt(0).toUpperCase() + funcName.slice(1));
                this.writePunctuation("(");
                this.emitArguments(node.arguments);
                this.writePunctuation(")");
                return;
            }
            const namedImport = this.getNamedImport(funcName);
            if (namedImport) {
                this.write(namedImport);
                this.writePunctuation("(");
                this.emitArguments(node.arguments);
                this.writePunctuation(")");
                return;
            }
            if (this.isExportedName(funcName)) {
                this.write(funcName.charAt(0).toUpperCase() + funcName.slice(1));
                this.writePunctuation("(");
                this.emitArguments(node.arguments);
                this.writePunctuation(")");
                return;
            }
        }

        this.emitExpression(node.expression);
        this.writePunctuation("(");
        this.emitArguments(node.arguments);
        this.writePunctuation(")");
    }

    private emitConsoleCall(method: string, args: ts.NodeArray<ts.Expression>): void {
        this.importedPackages.add("fmt");

        switch (method) {
            case "log":
            case "info":
            case "debug":
                this.write("fmt.Println");
                break;
            case "error":
            case "warn":
                this.write("fmt.Fprintln(os.Stderr)");
                this.importedPackages.add("os");
                break;
            default:
                this.write("fmt.Println");
        }

        this.writePunctuation("(");
        this.emitArguments(args);
        this.writePunctuation(")");
    }

    private emitMathCall(method: string, args: ts.NodeArray<ts.Expression>): void {
        this.importedPackages.add("math");

        const mathMap: Record<string, string> = {
            "abs": "math.Abs",
            "ceil": "math.Ceil",
            "floor": "math.Floor",
            "round": "math.Round",
            "sqrt": "math.Sqrt",
            "pow": "math.Pow",
            "log": "math.Log",
            "log2": "math.Log2",
            "log10": "math.Log10",
            "exp": "math.Exp",
            "sin": "math.Sin",
            "cos": "math.Cos",
            "tan": "math.Tan",
            "asin": "math.Asin",
            "acos": "math.Acos",
            "atan": "math.Atan",
            "atan2": "math.Atan2",
            "max": "math.Max",
            "min": "math.Min",
            "random": "rand.Float64",
            "PI": "math.Pi",
            "E": "math.E",
        };

        if (method === "random") {
            this.importedPackages.add("math/rand");
        }

        const goMethod = mathMap[method] || "math." + this.toPascalCase(method);
        this.write(goMethod);
        this.writePunctuation("(");
        this.emitArguments(args);
        this.writePunctuation(")");
    }

    private emitStringMethodCall(propExpr: PropertyAccessExpression, args: ts.NodeArray<ts.Expression>): void {
        this.importedPackages.add("strings");

        const str = (propExpr.expression as ts.StringLiteral).text;
        const method = this.getTextOfNode(propExpr.name);

        const stringMethods: Record<string, {fn: string, reverse?: boolean}> = {
            "toUpperCase": {fn: "strings.ToUpper"},
            "toLowerCase": {fn: "strings.ToLower"},
            "trim": {fn: "strings.Trim", reverse: true},
            "trimStart": {fn: "strings.TrimLeft", reverse: true},
            "trimEnd": {fn: "strings.TrimRight", reverse: true},
            "indexOf": {fn: "strings.Index"},
            "lastIndexOf": {fn: "strings.LastIndex"},
            "includes": {fn: "strings.Contains"},
            "startsWith": {fn: "strings.HasPrefix"},
            "endsWith": {fn: "strings.HasSuffix"},
            "replace": {fn: "strings.Replace", reverse: true},
            "replaceAll": {fn: "strings.ReplaceAll"},
            "split": {fn: "strings.Split"},
            "substring": {fn: "strings.Substr"},
        };

        const methodInfo = stringMethods[method];
        if (methodInfo) {
            this.write(methodInfo.fn);
            this.writePunctuation("(");
            if (methodInfo.reverse) {
                this.writeStringLiteral(str);
                this.writePunctuation(",");
                this.writeSpace();
                this.emitArguments(args);
            } else {
                this.writeStringLiteral(str);
                if (args.length > 0) {
                    this.writePunctuation(",");
                    this.writeSpace();
                    this.emitArguments(args);
                }
            }
            this.writePunctuation(")");
        } else {
            this.writeStringLiteral(str);
            this.writePunctuation(".");
            this.write(method);
            this.writePunctuation("(");
            this.emitArguments(args);
            this.writePunctuation(")");
        }
    }

    private emitMethodCall(propExpr: PropertyAccessExpression, args: ts.NodeArray<ts.Expression>): void {
        this.emitExpression(propExpr.expression);
        this.writePunctuation(".");
        this.write(this.toPascalCase(this.getTextOfNode(propExpr.name)));
        this.writePunctuation("(");
        this.emitArguments(args);
        this.writePunctuation(")");
    }

    protected emitArguments(args: ts.NodeArray<ts.Expression>): void {
        for (let i = 0; i < args.length; i++) {
            const arg = args[i];
            if (ts.isStringLiteral(arg)) {
                this.write(this.escapeStringForGo(arg.text));
            } else {
                this.emitExpression(arg);
            }
            if (i < args.length - 1) {
                this.writePunctuation(",");
                this.writeSpace();
            }
        }
    }

    emitNewExpression(node: NewExpression): void {
        const typeName = this.getTextOfNode(node.expression);

        if (typeName === "RegExp") {
            this.write("typoly.NewRegExp");
            this.writePunctuation("(");
            if (node.arguments && node.arguments.length > 0) {
                this.emitExpression(node.arguments[0]);
                if (node.arguments.length > 1) {
                    this.writePunctuation(",");
                    this.writeSpace();
                    this.emitExpression(node.arguments[1]);
                }
            } else {
                this.writeStringLiteral("");
            }
            this.writePunctuation(")");
            return;
        }

        const pascalName = this.toPascalCase(typeName);
        this.write("&");
        this.write(pascalName);
        this.writePunctuation("{");
        for (let i = 0; i < (node.arguments?.length || 0); i++) {
            this.emitExpression(node.arguments![i]);
            if (i < (node.arguments?.length || 0) - 1) {
                this.writePunctuation(",");
                this.writeSpace();
            }
        }
        this.writePunctuation("}");
    }

    emitAwaitExpression(node: AwaitExpression): void {
        this.emitExpression(node.expression);
    }

    emitYieldExpression(node: YieldExpression): void {
        this.writeComment("// yield not supported in Go");
    }

    emitTaggedTemplateExpression(node: TaggedTemplateExpression): void {
        this.writeComment("// tagged template not supported");
    }

    emitConditionalExpression(node: ConditionalExpression): void {
        this.write("func() interface{} { if ");
        this.emitExpression(node.condition);
        this.write(" { return ");
        this.emitExpression(node.whenTrue);
        this.write(" }; return ");
        this.emitExpression(node.whenFalse);
        this.write(" }()");
    }

    emitElementAccessExpression(node: ElementAccessExpression): void {
        this.emitExpression(node.expression);
        this.writePunctuation("[");
        if (node.argumentExpression) {
            this.emitExpression(node.argumentExpression);
        }
        this.writePunctuation("]");
    }

    emitNonNullExpression(node: NonNullExpression): void {
        this.emitExpression(node.expression);
    }

    emitPrefixUnaryExpression(node: PrefixUnaryExpression): void {
        const operator = node.operator;
        switch (operator) {
            case ts.SyntaxKind.ExclamationToken:
                this.writeOperator("!");
                break;
            case ts.SyntaxKind.MinusToken:
                this.writeOperator("-");
                break;
            case ts.SyntaxKind.PlusToken:
                break;
            case ts.SyntaxKind.TildeToken:
                this.writeOperator("~");
                break;
            case ts.SyntaxKind.PlusPlusToken:
                this.writeOperator("++");
                break;
            case ts.SyntaxKind.MinusMinusToken:
                this.writeOperator("--");
                break;
            default:
                this.writeComment("// unsupported prefix");
                break;
        }
        this.emitExpression(node.operand);
    }

    emitPostfixUnaryExpression(node: PostfixUnaryExpression): void {
        this.emitExpression(node.operand);
        const operator = node.operator;
        switch (operator) {
            case ts.SyntaxKind.PlusPlusToken:
                this.writeOperator("++");
                break;
            case ts.SyntaxKind.MinusMinusToken:
                this.writeOperator("--");
                break;
            default:
                this.writeComment("// unsupported postfix");
                break;
        }
    }

    emitArrowFunction(node: ArrowFunction): void {
        this.write("func(");
        this.emitParamsList(node.parameters);
        this.writePunctuation(")");
        if (node.type) {
            this.writeSpace();
            this.write(this.typeToString(node.type));
        }
        this.writeSpace();
        if (ts.isBlock(node.body)) {
            this.emitBlock(node.body);
        } else {
            this.writePunctuation("{ return ");
            this.emitExpression(node.body);
            this.writePunctuation(" }");
        }
    }

    emitFunctionExpression(node: FunctionExpression): void {
        this.write("func(");
        this.emitParamsList(node.parameters);
        this.writePunctuation(")");
        if (node.type) {
            this.writeSpace();
            this.write(this.typeToString(node.type));
        }
        this.writeSpace();
        this.emitBlock(node.body);
    }

    emitArrayLiteralExpression(node: ts.ArrayLiteralExpression): void {
        if (node.elements.length === 0) {
            this.write("[]interface{}{}");
            return;
        }

        let elemType = "interface{}";
        const firstElem = node.elements[0];
        if (ts.isNumericLiteral(firstElem)) {
            elemType = "float64";
        } else if (ts.isStringLiteral(firstElem)) {
            elemType = "string";
        } else if (firstElem.kind === ts.SyntaxKind.TrueKeyword ||
                   firstElem.kind === ts.SyntaxKind.FalseKeyword) {
            elemType = "bool";
        }

        this.write("[]");
        this.write(elemType);
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
        this.write("map[string]interface{}{");
        this.writeLine();
        this.increaseIndent();
        for (let i = 0; i < node.properties.length; i++) {
            const prop = node.properties[i];
            if (ts.isPropertyAssignment(prop)) {
                if (ts.isIdentifier(prop.name)) {
                    this.write("\"");
                    this.write(this.getTextOfNode(prop.name));
                    this.write("\"");
                } else if (ts.isStringLiteral(prop.name)) {
                    this.writeStringLiteral(prop.name.text);
                }
                this.writePunctuation(":");
                this.writeSpace();
                this.emitExpression(prop.initializer);
                if (i < node.properties.length - 1) {
                    this.writePunctuation(",");
                }
                this.writeLine();
            }
        }
        this.decreaseIndent();
        this.writePunctuation("}");
    }

    writeTokenNode(node: ts.Node, writer: (s: string) => void): void {
        const kind = node.kind;
        if (kind === ts.SyntaxKind.NullKeyword) {
            writer("nil");
            return;
        }
        if (kind === ts.SyntaxKind.UndefinedKeyword) {
            writer("nil");
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
