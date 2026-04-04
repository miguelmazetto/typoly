import * as ts from 'typescript';
import type { Node, Expression } from 'typescript';
import { RawTypescriptPrinter } from './ts_printer';
import type { EmitterExtraContext } from './emitter_extra';

export class TypolyBasePrinter extends RawTypescriptPrinter {
    typeChecker: ts.TypeChecker | undefined;
    packageName: string = "main";
    currentModuleName: string = "";
    namespaceImports: Map<string, string> = new Map();
    namedImports: Map<string, string> = new Map();

    constructor(printerOptions: any = {}, handlers: any = {}, extra: EmitterExtraContext) {
        super(printerOptions, handlers, extra);
        if (extra && extra.typeChecker) {
            this.typeChecker = extra.typeChecker;
        }
    }

    // --- Shared helpers ---

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

    protected getImportedModuleName(expr: ts.Expression): string | undefined {
        if (!ts.isIdentifier(expr)) return undefined;
        return this.namespaceImports.get(expr.text);
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

    protected escapeString(str: string): string {
        return '"' + str
            .replace(/\\/g, '\\\\')
            .replace(/"/g, '\\"')
            .replace(/\n/g, '\\n')
            .replace(/\r/g, '\\r')
            .replace(/\t/g, '\\t') + '"';
    }

    // Extract a simple value from an argument node
    protected extractArgumentValue(arg: ts.Expression): any {
        if (ts.isStringLiteral(arg)) return arg.text;
        if (ts.isNumericLiteral(arg)) return parseFloat(arg.text);
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
    protected extractOptionValueFromArgs(
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
    protected getArgumentDataType(arg: ts.Expression): string | undefined {
        if (ts.isStringLiteral(arg)) return 'string';
        if (ts.isNumericLiteral(arg)) return 'number';
        if (arg.kind === ts.SyntaxKind.TrueKeyword || arg.kind === ts.SyntaxKind.FalseKeyword) return 'boolean';
        if (ts.isArrayLiteralExpression(arg)) return 'array';
        if (ts.isObjectLiteralExpression(arg)) return 'object';
        return undefined;
    }
}
