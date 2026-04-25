import * as ts from 'typescript';

import type { SourceFile, Identifier, Node, TypeNode } from "typescript";
import { TypolyBasePrinter } from '../../common/base_printer';
import { loadFunctionOverrides, resolveFunctionOverride, hasFunctionOverrides } from '../config/resolver';

export class CppPrinterBase extends TypolyBasePrinter {
    packageName: string = "typoly";
    importedModuleNames: string[] = [];
    functionOverrides = loadFunctionOverrides();

    constructor(printerOptions: any = {}, handlers: any = {}, extra: any) {
        super(printerOptions, handlers, extra);
    }

    // Module name helpers (C++ specific)
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

    // Type mapping (C++ specific)
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

    // Type inference (C++ specific)
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

        if (tsType.startsWith("Promise<")) {
            const inner = tsType.slice(8, -1);
            return "Promise<" + this.mapInferredType(inner) + ">";
        }

        return tsType;
    }

    protected escapeStringForCpp(str: string): string {
        return this.escapeString(str);
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

    protected isImportedNamespace(expr: ts.Expression): boolean {
        if (!ts.isIdentifier(expr)) return false;
        return this.namespaceImports.has(expr.text);
    }

    override getTextOfNode(node: Node): string {
        if (node.kind === ts.SyntaxKind.Identifier) {
            return this.escapeCppKeyword((node as Identifier).escapedText.toString());
        }
        return super.getTextOfNode(node as any);
    }

    protected resolveFunctionOverride(
        fullFunctionName: string,
        args: ts.NodeArray<ts.Expression>
    ): { cppFunction: string; returnType?: string } | null {
        if (!hasFunctionOverrides(fullFunctionName)) return null;
        const argValues: any[] = [];
        for (const arg of args) {
            argValues.push(this.extractArgumentValue(arg));
        }
        const config = this.functionOverrides.functions[fullFunctionName];
        let optionValue: string | undefined;
        let dataType: string | undefined;
        if (config.optionParameter !== undefined && config.optionName) {
            optionValue = this.extractOptionValueFromArgs(args, config.optionParameter, config.optionName);
        }
        if (args.length > 0) {
            dataType = this.getArgumentDataType(args[0]);
        }
        return resolveFunctionOverride(fullFunctionName, argValues, optionValue, dataType);
    }
}
