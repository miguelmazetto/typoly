import { CPrinter } from "base_printer";
import * as ts from 'typescript';
import type { SourceFile, Identifier, Node, TypeNode } from "typescript";
import { loadFunctionOverrides, resolveFunctionOverride } from '../config/resolver';

export class GoPrinterBase extends CPrinter {
    typeChecker: ts.TypeChecker | undefined;
    packageName: string = "main";
    currentModuleName: string = "";
    currentPackagePath: string = "";
    importedPackages: Set<string> = new Set();
    namespaceImports: Map<string, string> = new Map();
    namedImports: Map<string, string> = new Map();
    usedHelpers: Set<string> = new Set();
    functionOverrides = loadFunctionOverrides();

    constructor(printerOptions: any = {}, handlers: any = {}, extra: any) {
        super(printerOptions, handlers, extra);
        if (extra && extra.typeChecker) {
            this.typeChecker = extra.typeChecker;
        }
    }

    // Module/package name helpers
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
        
        // Last part is the package name
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
        return name;
    }

    // Type mapping
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
            case ts.SyntaxKind.NullKeyword:
                return "interface{}";
            case ts.SyntaxKind.NeverKeyword:
                return "interface{}";
            case ts.SyntaxKind.ArrayType:
                const elementType = this.typeToString((typeNode as ts.ArrayTypeNode).elementType);
                return `[]${elementType}`;
            case ts.SyntaxKind.TypeReference:
                return this.handleTypeReference(typeNode as ts.TypeReferenceNode);
            case ts.SyntaxKind.UnionType:
                return "interface{}"; // Go doesn't have union types
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

    // Type inference using typechecker
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
    protected escapeStringForGo(str: string): string {
        return '"' + str
            .replace(/\\/g, '\\\\')
            .replace(/"/g, '\\"')
            .replace(/\n/g, '\\n')
            .replace(/\r/g, '\\r')
            .replace(/\t/g, '\\t') + '"';
    }

    protected toCamelCase(str: string): string {
        return str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
    }

    protected toPascalCase(str: string): string {
        const camel = this.toCamelCase(str);
        return camel.charAt(0).toUpperCase() + camel.slice(1);
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
                return this.toPascalCase(this.getTextOfNode((parent as ts.ClassDeclaration).name!));
            }
            parent = parent.parent;
        }
        return "Unknown";
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

    protected getImportedModuleName(expr: ts.Expression): string | undefined {
        if (!ts.isIdentifier(expr)) return undefined;
        return this.namespaceImports.get(expr.text);
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
    
    private getArgumentDataType(arg: ts.Expression): string | undefined {
        if (ts.isStringLiteral(arg)) return 'string';
        if (ts.isNumericLiteral(arg)) return 'number';
        if (arg.kind === ts.SyntaxKind.TrueKeyword || arg.kind === ts.SyntaxKind.FalseKeyword) return 'boolean';
        if (ts.isArrayLiteralExpression(arg)) return 'array';
        if (ts.isObjectLiteralExpression(arg)) return 'object';
        return undefined;
    }
}
