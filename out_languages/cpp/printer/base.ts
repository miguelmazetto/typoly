import { CPrinter } from "base_printer";
import * as ts from 'typescript';
import type { SourceFile, Identifier, Node, TypeNode } from "typescript";
import { loadFunctionOverrides, resolveFunctionOverride, hasFunctionOverrides, extractOptionValue, getArgumentDataType } from '../config/resolver';

export class CppPrinterBase extends CPrinter {
    typeChecker: ts.TypeChecker | undefined;
    packageName: string = "typoly";
    currentModuleName: string = "";
    namespaceImports: Map<string, string> = new Map();
    importedModuleNames: string[] = [];
    namedImports: Map<string, string> = new Map();
    functionOverrides = loadFunctionOverrides();

    constructor(printerOptions: any = {}, handlers: any = {}, extra: any) {
        super(printerOptions, handlers, extra);
        if (extra && extra.typeChecker) {
            this.typeChecker = extra.typeChecker;
        }
    }

    // Module name helpers
    protected computeModuleName(filePath: string): string {
        const baseDir = process.cwd() || ".";
        let relPath = filePath.replace(/\\/g, "/");
        const baseDirNormalized = baseDir.replace(/\\/g, "/");
        
        if (relPath.startsWith(baseDirNormalized + "/")) {
            relPath = relPath.substring(baseDirNormalized.length + 1);
        }
        
        relPath = relPath.replace(/\.tsx?$/, "");
        relPath = relPath.replace(/-/g, "_");
        const parts = relPath.split("/").filter(p => p && p !== ".");
        return parts.join("__");
    }

    protected toCppModulePath(tsModuleName: string): string {
        let name = tsModuleName.replace(/^["']|["']$/g, "");
        name = name.replace(/^(\.\/)/, "");
        name = name.replace(/^(\.\.\/)/, "../");
        name = name.replace(/\//g, "__");
        name = name.replace(/\./g, "");
        name = name.replace(/-/g, "_");
        name = name.replace(/\.tsx?$/, "");
        return name;
    }

    // Type mapping
    protected typeToString(typeNode: TypeNode): string {
        switch (typeNode.kind) {
            case ts.SyntaxKind.StringKeyword:
                return "String";
            case ts.SyntaxKind.NumberKeyword:
                return "double";
            case ts.SyntaxKind.BooleanKeyword:
                return "bool";
            case ts.SyntaxKind.VoidKeyword:
                return "void";
            case ts.SyntaxKind.AnyKeyword:
            case ts.SyntaxKind.UnknownKeyword:
                return "Value";
            case ts.SyntaxKind.UndefinedKeyword:
            case ts.SyntaxKind.NullKeyword:
                return "Value";
            case ts.SyntaxKind.ArrayType:
                const elementType = this.typeToString((typeNode as ts.ArrayTypeNode).elementType);
                return `Vector<${elementType}>`;
            case ts.SyntaxKind.TypeReference:
                return this.handleTypeReference(typeNode as ts.TypeReferenceNode);
            case ts.SyntaxKind.UnionType:
                const unionNode = typeNode as ts.UnionTypeNode;
                const types = unionNode.types.map(t => this.typeToString(t));
                return `Union<${types.join(", ")}>`;
            case ts.SyntaxKind.IntersectionType:
                const interNode = typeNode as ts.IntersectionTypeNode;
                return this.typeToString(interNode.types[0]);
            case ts.SyntaxKind.FunctionType:
                return "Function";
            case ts.SyntaxKind.NeverKeyword:
                return "void";
            default:
                return "Value";
        }
    }

    protected handleTypeReference(ref: ts.TypeReferenceNode): string {
        const typeName = this.getTextOfNode(ref.typeName);
        
        const typeMap: Record<string, (args: ts.NodeArray<ts.TypeNode> | undefined) => string> = {
            "Array": (args) => {
                const element = args ? this.typeToString(args[0]) : "Value";
                return `Vector<${element}>`;
            },
            "Map": (args) => {
                const key = args ? this.typeToString(args[0]) : "Value";
                const value = args ? this.typeToString(args[1]) : "Value";
                return `Map<${key}, ${value}>`;
            },
            "Set": (args) => {
                const element = args ? this.typeToString(args[0]) : "Value";
                return `Set<${element}>`;
            },
            "Promise": (args) => {
                const inner = args ? this.typeToString(args[0]) : "Value";
                return `Promise<${inner}>`;
            },
            "RegExp": () => "RegExp",
            "Date": () => "Date",
            "Error": () => "Error",
            "Buffer": () => "Buffer",
        };

        if (typeMap[typeName]) {
            return typeMap[typeName](ref.typeArguments);
        }
        
        return typeName;
    }

    // Type inference using typechecker
    protected mapInferredType(tsType: string): string {
        const typeMap: Record<string, string> = {
            "string": "String",
            "number": "double",
            "boolean": "bool",
            "void": "void",
            "undefined": "Value",
            "null": "Value",
            "any": "Value",
            "unknown": "Value",
            "never": "void",
            "RegExp": "RegExp",
            "Date": "Date",
            "Error": "Error",
            "Buffer": "String",
            "NonSharedBuffer": "String",
            "Uint8Array": "Vector<double>",
            "ArrayBuffer": "String",
        };
        
        if (typeMap[tsType]) {
            return typeMap[tsType];
        }
        
        // Handle literal types (e.g., "10", "'hello'", "true")
        if (/^-?\d+(\.\d+)?$/.test(tsType)) {
            return "double";
        }
        if (/^".*"$/.test(tsType) || /^'.*'$/.test(tsType)) {
            return "String";
        }
        if (tsType === "true" || tsType === "false") {
            return "bool";
        }
        
        if (tsType.startsWith("Array<")) {
            const inner = tsType.slice(6, -1);
            return "Vector<" + this.mapInferredType(inner) + ">";
        }
        
        if (tsType.endsWith("[]")) {
            const inner = tsType.slice(0, -2);
            return "Vector<" + this.mapInferredType(inner) + ">";
        }
        
        if (tsType.startsWith("Map<")) {
            const inner = tsType.slice(4, -1);
            const [key, value] = this.splitGenericArgs(inner);
            return "Map<" + this.mapInferredType(key) + ", " + this.mapInferredType(value) + ">";
        }
        
        if (tsType.startsWith("Set<")) {
            const inner = tsType.slice(4, -1);
            return "Set<" + this.mapInferredType(inner) + ">";
        }
        
        if (tsType.startsWith("Union<") || tsType.startsWith("Variant<")) {
            const inner = tsType.slice(tsType.indexOf('<') + 1, -1);
            const types = this.splitGenericArgs(inner);
            return `Union<${types[0]}, ${types[1]}>`;
        }
        
        // Handle union types from type checker (e.g., "string | number")
        if (tsType.includes(" | ")) {
            const parts = tsType.split(" | ");
            const mapped = parts.map(p => this.mapInferredType(p.trim()));
            return `Union<${mapped.join(", ")}>`;
        }
        
        if (tsType.startsWith("Union<") || tsType.startsWith("Variant<")) {
            const inner = tsType.slice(tsType.indexOf('<') + 1, -1);
            const types = this.splitGenericArgs(inner);
            return `Union<${types[0]}, ${types[1]}>`;
        }
        
        // Handle union types from type checker (e.g., "string | number")
        if (tsType.includes(" | ")) {
            const parts = tsType.split(" | ");
            const mapped = parts.map(p => this.mapInferredType(p.trim()));
            return `Union<${mapped.join(", ")}>`;
        }
        
        if (tsType.startsWith("Promise<")) {
            const inner = tsType.slice(8, -1);
            return "Promise<" + this.mapInferredType(inner) + ">";
        }
        
        return tsType;
    }

    protected splitGenericArgs(args: string): [string, string] {
        let depth = 0;
        let commaPos = -1;
        for (let i = 0; i < args.length; i++) {
            if (args[i] === '<') depth++;
            else if (args[i] === '>') depth--;
            else if (args[i] === ',' && depth === 0) {
                commaPos = i;
                break;
            }
        }
        if (commaPos === -1) return [args.trim(), ""];
        return [args.slice(0, commaPos).trim(), args.slice(commaPos + 1).trim()];
    }

    // Utility methods
    protected escapeStringForCpp(str: string): string {
        return '"' + str
            .replace(/\\/g, '\\\\')
            .replace(/"/g, '\\"')
            .replace(/\n/g, '\\n')
            .replace(/\r/g, '\\r')
            .replace(/\t/g, '\\t') + '"';
    }

    protected escapeCppKeyword(name: string): string {
        const cppKeywords = new Set([
            "class", "public", "private", "protected", "virtual", "override", "final",
            "const", "static", "template", "typename", "using", "namespace", "new",
            "delete", "this", "throw", "try", "catch", "finally", "auto", "bool",
            "char", "double", "float", "int", "long", "short", "signed", "unsigned",
            "void", "volatile", "wchar_t", "and", "or", "not", "if", "else", "switch",
            "case", "default", "for", "while", "do", "break", "continue", "return", "goto",
            "export", "module", "import", "operator", "sizeof", "typedef"
        ]);
        if (cppKeywords.has(name)) {
            return name + "_";
        }
        return name;
    }

    protected getOperatorText(operator: ts.SyntaxKind): string {
        return ts.tokenToString(operator) || "";
    }

    protected isExported(node: Node): boolean {
        const modifiers = this._getModifiers(node);
        if (modifiers) {
            for (const mod of modifiers) {
                if (mod.kind === ts.SyntaxKind.ExportKeyword) {
                    return true;
                }
            }
        }
        return false;
    }

    protected _getModifiers(node: Node): ts.NodeArray<ts.ModifierLike> | undefined {
        return 'modifiers' in node ? node.modifiers as ts.NodeArray<ts.ModifierLike> : undefined;
    }

    protected getContainingClassName(node: Node): string {
        let parent = node.parent;
        while (parent) {
            if (parent.kind === ts.SyntaxKind.ClassDeclaration && (parent as ts.ClassDeclaration).name) {
                return this.getTextOfNode((parent as ts.ClassDeclaration).name!);
            }
            parent = parent.parent;
        }
        return "UnknownClass";
    }

    protected getBaseClassName(node: Node): string | undefined {
        let parent = node.parent;
        while (parent) {
            if (parent.kind === ts.SyntaxKind.ClassDeclaration) {
                const classNode = parent as ts.ClassDeclaration;
                for (const clause of classNode.heritageClauses || []) {
                    if (clause.token === ts.SyntaxKind.ExtendsKeyword && clause.types.length) {
                        const baseExpr = clause.types[0].expression;
                        if (baseExpr.kind === ts.SyntaxKind.Identifier) {
                            return this.getTextOfNode(baseExpr);
                        }
                    }
                }
                break;
            }
            parent = parent.parent;
        }
        return undefined;
    }

    protected isImportedNamespace(expr: ts.Expression): boolean {
        if (!ts.isIdentifier(expr)) return false;
        return this.namespaceImports.has(expr.text);
    }

    protected getImportedModuleName(expr: ts.Expression): string | undefined {
        if (!ts.isIdentifier(expr)) return undefined;
        return this.namespaceImports.get(expr.text);
    }

    // Resolve function override based on call arguments
    protected resolveFunctionOverride(
        fullFunctionName: string,
        args: ts.NodeArray<ts.Expression>
    ): { cppFunction: string; returnType?: string } | null {
        if (!hasFunctionOverrides(fullFunctionName)) return null;
        
        // Extract argument values for resolution
        const argValues: any[] = [];
        for (const arg of args) {
            argValues.push(this.extractArgumentValue(arg));
        }
        
        // Try to get option value from the config
        const config = this.functionOverrides.functions[fullFunctionName];
        let optionValue: string | undefined;
        let dataType: string | undefined;
        
        if (config.optionParameter !== undefined && config.optionName) {
            optionValue = this.extractOptionValueFromArgs(args, config.optionParameter, config.optionName);
        }
        
        // Try to get data type of first argument
        if (args.length > 0) {
            dataType = this.getArgumentDataType(args[0]);
        }
        
        return resolveFunctionOverride(fullFunctionName, argValues, optionValue, dataType);
    }
    
    // Extract a simple value from an argument node
    private extractArgumentValue(arg: ts.Expression): any {
        if (ts.isStringLiteral(arg)) {
            return arg.text;
        }
        if (ts.isNumericLiteral(arg)) {
            return parseFloat(arg.text);
        }
        if (arg.kind === ts.SyntaxKind.TrueKeyword) return true;
        if (arg.kind === ts.SyntaxKind.FalseKeyword) return false;
        if (arg.kind === ts.SyntaxKind.NullKeyword) return null;
        if (ts.isObjectLiteralExpression(arg)) {
            const obj: any = {};
            for (const prop of arg.properties) {
                if (ts.isPropertyAssignment(prop) && ts.isIdentifier(prop.name)) {
                    obj[prop.name.text] = this.extractArgumentValue(prop.initializer);
                }
            }
            return obj;
        }
        return undefined;
    }
    
    // Extract option value from arguments
    private extractOptionValueFromArgs(
        args: ts.NodeArray<ts.Expression>,
        optionParamIndex: number,
        optionName: string
    ): string | undefined {
        if (optionParamIndex >= args.length) return undefined;
        
        const optionsArg = args[optionParamIndex];
        if (!ts.isObjectLiteralExpression(optionsArg)) return undefined;
        
        for (const prop of optionsArg.properties) {
            if (ts.isPropertyAssignment(prop) && ts.isIdentifier(prop.name)) {
                if (prop.name.text === optionName && ts.isStringLiteral(prop.initializer)) {
                    return prop.initializer.text;
                }
            }
        }
        return undefined;
    }
    
    // Get data type of an argument node
    private getArgumentDataType(arg: ts.Expression): string | undefined {
        if (ts.isStringLiteral(arg)) return 'string';
        if (ts.isNumericLiteral(arg)) return 'number';
        if (arg.kind === ts.SyntaxKind.TrueKeyword || arg.kind === ts.SyntaxKind.FalseKeyword) return 'boolean';
        if (ts.isArrayLiteralExpression(arg)) return 'array';
        if (ts.isObjectLiteralExpression(arg)) return 'object';
        return undefined;
    }

    getTextOfNode(node: Node): string {
        if (node.kind === ts.SyntaxKind.Identifier) {
            return this.escapeCppKeyword((node as Identifier).escapedText.toString());
        }
        return super.getTextOfNode(node as any);
    }
}
