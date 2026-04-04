import * as ts from 'typescript';
import type { SourceFile, Identifier, Node, TypeNode } from "typescript";
import { TypolyBasePrinter } from '../../common/base_printer';
import { loadFunctionOverrides, resolveFunctionOverride } from '../config/resolver';

export class GoPrinterBase extends TypolyBasePrinter {
    packageName: string = "main";
    currentPackagePath: string = "";
    importedPackages: Set<string> = new Set();
    usedHelpers: Set<string> = new Set();
    functionOverrides = loadFunctionOverrides();

    constructor(printerOptions: any = {}, handlers: any = {}, extra: any) {
        super(printerOptions, handlers, extra);
    }

    // Go-specific package naming
    protected computePackageName(filePath: string): string {
        const baseDir = process.cwd() || ".";
        let relPath = filePath.replace(/\\/g, "/");
        const baseDirNormalized = baseDir.replace(/\\/g, "/");
        if (relPath.startsWith(baseDirNormalized + "/")) {
            relPath = relPath.substring(baseDirNormalized.length + 1);
        }
        relPath = relPath.replace(/\.go$/, "");
        relPath = relPath.replace(/\.ts$/, "");
        relPath = relPath.replace(/-/g, "_");
        relPath = relPath.replace(/\./g, "_");
        const parts = relPath.split("/").filter(p => p && p !== ".");
        return parts[parts.length - 1] || "main";
    }

    protected computeImportPath(tsModuleName: string): string {
        let name = tsModuleName.replace(/^["']|["']$/g, "");
        name = name.replace(/^(\.\/)/, "");
        name = name.replace(/^(\.\.\/)/, "../");
        name = name.replace(/\\/g, "/");
        name = name.replace(/\.tsx?$/, "");
        name = name.replace(/\./g, "_");
        name = name.replace(/-/g, "_");
        return "test_package/" + name;
    }

    // Go-specific type mapping
    protected typeToString(typeNode: TypeNode): string {
        switch (typeNode.kind) {
            case ts.SyntaxKind.StringKeyword:
                return "string";
            case ts.SyntaxKind.NumberKeyword:
                return "float64";
            case ts.SyntaxKind.BooleanKeyword:
                return "bool";
            case ts.SyntaxKind.VoidKeyword:
                return "";
            case ts.SyntaxKind.AnyKeyword:
            case ts.SyntaxKind.UnknownKeyword:
                return "interface{}";
            case ts.SyntaxKind.UndefinedKeyword:
                return "interface{}";
            case ts.SyntaxKind.NullKeyword as unknown as ts.SyntaxKind:
                return "interface{}";
            case ts.SyntaxKind.NeverKeyword:
                return "interface{}";
            case ts.SyntaxKind.UnionType:
                return "interface{}";
            case ts.SyntaxKind.ArrayType:
                const elementType = this.typeToString((typeNode as ts.ArrayTypeNode).elementType);
                return `[]${elementType}`;
            case ts.SyntaxKind.TypeReference:
                return this.handleTypeReference(typeNode as ts.TypeReferenceNode);
            case ts.SyntaxKind.IntersectionType:
                return "interface{}";
            case ts.SyntaxKind.FunctionType:
                return "func";
            default:
                return "interface{}";
        }
    }

    protected handleTypeReference(ref: ts.TypeReferenceNode): string {
        const typeName = this.getTextOfNode(ref.typeName);

        const typeMap: Record<string, (args: ts.NodeArray<ts.TypeNode> | undefined) => string> = {
            "Array": (args) => {
                const element = args ? this.typeToString(args[0]) : "interface{}";
                return `[]${element}`;
            },
            "Map": (args) => {
                const key = args ? this.typeToString(args[0]) : "string";
                const value = args ? this.typeToString(args[1]) : "interface{}";
                return `map[${key}]${value}`;
            },
            "Set": (args) => {
                const element = args ? this.typeToString(args[0]) : "interface{}";
                return `map[${element}]struct{}`;
            },
            "Promise": (args) => {
                return args ? this.typeToString(args[0]) : "interface{}";
            },
            "RegExp": () => "*regexp.Regexp",
            "Date": () => "time.Time",
            "Error": () => "error",
            "Buffer": () => "[]byte",
            "String": () => "string",
            "Vector": (args) => {
                const element = args ? this.typeToString(args[0]) : "interface{}";
                return `[]${element}`;
            },
        };

        if (typeMap[typeName]) {
            return typeMap[typeName](ref.typeArguments);
        }

        return typeName;
    }

    // Go-specific type inference
    protected mapInferredType(tsType: string): string {
        const typeMap: Record<string, string> = {
            "string": "string",
            "number": "float64",
            "boolean": "bool",
            "void": "",
            "undefined": "interface{}",
            "null": "interface{}",
            "any": "interface{}",
            "unknown": "interface{}",
            "never": "interface{}",
            "RegExp": "*regexp.Regexp",
            "Date": "time.Time",
            "Error": "error",
        };

        if (typeMap[tsType]) {
            return typeMap[tsType];
        }

        if (tsType.includes("|")) {
            return "interface{}";
        }

        if (tsType.startsWith("Array<")) {
            const inner = tsType.slice(6, -1);
            return "[]" + this.mapInferredType(inner);
        }

        if (tsType.endsWith("[]")) {
            const inner = tsType.slice(0, -2);
            return "[]" + this.mapInferredType(inner);
        }

        if (tsType.startsWith("Map<")) {
            const inner = tsType.slice(4, -1);
            const [key, value] = this.splitGenericArgs(inner);
            return `map[${this.mapInferredType(key)}]${this.mapInferredType(value)}`;
        }

        return tsType;
    }

    protected escapeStringForGo(str: string): string {
        return this.escapeString(str);
    }

    // Go-specific name conversion
    protected toCamelCase(str: string): string {
        return str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
    }

    protected toPascalCase(str: string): string {
        const camel = this.toCamelCase(str);
        return camel.charAt(0).toUpperCase() + camel.slice(1);
    }

    // Override to add PascalCase wrapping
    override getContainingClassName(node: Node): string {
        let parent = node.parent;
        while (parent) {
            if (parent.kind === ts.SyntaxKind.ClassDeclaration && (parent as ts.ClassDeclaration).name) {
                return this.toPascalCase(this.getTextOfNode((parent as ts.ClassDeclaration).name!));
            }
            parent = parent.parent;
        }
        return "Unknown";
    }

    override getBaseClassName(node: Node): string | undefined {
        let parent = node.parent;
        while (parent) {
            if (parent.kind === ts.SyntaxKind.ClassDeclaration) {
                const classNode = parent as ts.ClassDeclaration;
                for (const clause of classNode.heritageClauses || []) {
                    if (clause.token === ts.SyntaxKind.ExtendsKeyword && clause.types.length) {
                        const baseExpr = clause.types[0].expression;
                        if (baseExpr.kind === ts.SyntaxKind.Identifier) {
                            return this.toPascalCase(this.getTextOfNode(baseExpr));
                        }
                    }
                }
                break;
            }
            parent = parent.parent;
        }
        return undefined;
    }

    getTextOfNode(node: Node): string {
        if (node.kind === ts.SyntaxKind.Identifier) {
            return (node as Identifier).escapedText.toString();
        }
        return super.getTextOfNode(node as any);
    }

    protected resolveFunctionOverride(
        fullFunctionName: string,
        args: ts.NodeArray<ts.Expression>
    ): { cppFunction: string; returnType?: string } | null {
        if (!this.functionOverrides.functions[fullFunctionName]) return null;
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
