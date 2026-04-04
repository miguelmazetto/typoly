import * as ts from 'typescript';
import type {
    ClassDeclaration,
    FunctionDeclaration,
    EnumDeclaration,
    InterfaceDeclaration,
    TypeAliasDeclaration,
    ModuleDeclaration,
    VariableStatement,
    PropertyDeclaration,
    MethodDeclaration,
    ConstructorDeclaration,
    GetAccessorDeclaration,
    SetAccessorDeclaration,
    ClassElement,
} from "typescript";
import { GoPrinterBase } from '../base';

export class DeclarationsMixin extends GoPrinterBase {
    private currentClassName: string = "";

    trackInterfaceVar(_name: string): void {}
    isInterfaceVarAccess(_expr: ts.Expression): boolean { return false; }
    trackExportedName(_name: string): void {}
    isExportedName(_name: string): boolean { return false; }
    getNamedImport(_name: string): string | undefined { return undefined; }
    trackValueVar(_name: string): void {}

    emitClassDeclaration(node: ClassDeclaration): void {
        const className = this.toPascalCase(this.getTextOfNode(node.name!));
        this.currentClassName = className;

        const fields: {name: string, type: string, exported: boolean}[] = [];
        const methods: MethodDeclaration[] = [];
        let constructorNode: ConstructorDeclaration | undefined;

        for (const member of node.members) {
            if (member.kind === ts.SyntaxKind.PropertyDeclaration) {
                const prop = member as PropertyDeclaration;
                const propName = this.getTextOfNode(prop.name);
                const propType = prop.type ? this.typeToString(prop.type) : "interface{}";
                const isExported = !prop.modifiers?.some((m: any) => m.kind === ts.SyntaxKind.PrivateKeyword);
                fields.push({
                    name: this.toPascalCase(propName),
                    type: propType,
                    exported: isExported
                });
            } else if (member.kind === ts.SyntaxKind.MethodDeclaration) {
                methods.push(member as MethodDeclaration);
            } else if (member.kind === ts.SyntaxKind.Constructor) {
                constructorNode = member as ConstructorDeclaration;
            }
        }

        let embeddedFields: string[] = [];
        if (node.heritageClauses) {
            for (const clause of node.heritageClauses) {
                if (clause.token === ts.SyntaxKind.ExtendsKeyword) {
                    for (const type of clause.types) {
                        const baseName = this.toPascalCase(this.getTextOfNode(type.expression));
                        embeddedFields.push(baseName);
                    }
                }
            }
        }

        this.write("type ");
        this.write(className);
        this.write(" struct {");
        this.writeLine();
        this.increaseIndent();

        for (const base of embeddedFields) {
            this.write(base);
            this.writeLine();
        }

        for (const field of fields) {
            if (field.exported) {
                this.write(field.name);
            } else {
                this.write(field.name.charAt(0).toLowerCase() + field.name.slice(1));
            }
            this.writeSpace();
            this.write(field.type);
            this.writeLine();
        }

        this.decreaseIndent();
        this.writePunctuation("}");
        this.writeLine();
        this.writeLine();

        if (constructorNode) {
            this.emitConstructorFunction(className, constructorNode, fields, embeddedFields);
        }

        for (const method of methods) {
            this.emitMethod(method, className);
        }

        this.currentClassName = "";
    }

    private emitConstructorFunction(
        className: string,
        node: ConstructorDeclaration,
        fields: {name: string, type: string, exported: boolean}[],
        embeddedFields: string[]
    ): void {
        this.write("func New");
        this.write(className);
        this.writePunctuation("(");
        this.emitParamsList(node.parameters);
        this.writePunctuation(")");
        this.writeSpace();
        this.writePunctuation("*");
        this.write(className);
        this.writeSpace();
        this.writePunctuation("{");
        this.writeLine();
        this.increaseIndent();

        this.write("return &");
        this.write(className);
        this.writePunctuation("{");
        this.writeLine();
        this.increaseIndent();

        for (const field of fields) {
            let matchedParam: string | undefined;

            for (const param of node.parameters) {
                const paramName = this.getTextOfNode(param.name);
                if (paramName.toLowerCase() === field.name.toLowerCase() ||
                    paramName.toLowerCase() === field.name.charAt(0).toLowerCase() + field.name.slice(1).toLowerCase()) {
                    matchedParam = paramName;
                    break;
                }
            }

            if (!matchedParam && node.body) {
                for (const stmt of node.body.statements) {
                    if (ts.isExpressionStatement(stmt)) {
                        const expr = stmt.expression;
                        if (ts.isBinaryExpression(expr) &&
                            expr.operatorToken.kind === ts.SyntaxKind.EqualsToken &&
                            ts.isPropertyAccessExpression(expr.left) &&
                            expr.left.expression.kind === ts.SyntaxKind.ThisKeyword) {
                            const propName = this.getTextOfNode(expr.left.name);
                            if (propName.toLowerCase() === field.name.toLowerCase()) {
                                if (ts.isIdentifier(expr.right)) {
                                    matchedParam = this.getTextOfNode(expr.right);
                                }
                                break;
                            }
                        }
                    }
                }
            }

            if (matchedParam) {
                this.write(field.name);
                this.writePunctuation(":");
                this.writeSpace();
                this.write(matchedParam);
                this.writePunctuation(",");
                this.writeLine();
            }
        }

        this.decreaseIndent();
        this.writePunctuation("}");
        this.writeLine();

        this.decreaseIndent();
        this.writePunctuation("}");
        this.writeLine();
        this.writeLine();
    }

    private emitMethod(node: MethodDeclaration, receiverType: string): void {
        const methodName = this.toPascalCase(this.getTextOfNode(node.name));
        const isExported = !node.modifiers?.some((m: any) => m.kind === ts.SyntaxKind.PrivateKeyword);

        if (node.typeParameters && node.typeParameters.length > 0) {
            this.writeComment("// Generic method - simplified");
            this.writeLine();
        }

        this.write("func (this *");
        this.write(receiverType);
        this.writePunctuation(")");
        this.writeSpace();

        if (isExported) {
            this.write(methodName);
        } else {
            this.write(methodName.charAt(0).toLowerCase() + methodName.slice(1));
        }

        this.writePunctuation("(");
        this.emitParamsList(node.parameters);
        this.writePunctuation(")");

        if (node.type) {
            this.writeSpace();
            this.write(this.typeToString(node.type));
        }

        this.writeSpace();
        if (node.body) {
            this.emitBlock(node.body);
        }
        this.writeLine();
        this.writeLine();
    }

    emitFunctionDeclaration(node: FunctionDeclaration): void {
        const funcName = this.getTextOfNode(node.name!);
        const isExported = this.isExported(node);
        const goFuncName = isExported ? this.toPascalCase(funcName) : funcName;

        if (node.typeParameters && node.typeParameters.length > 0) {
            this.writeComment("// Generic function - simplified");
            this.writeLine();
        }

        this.write("func ");
        this.write(goFuncName);
        if (isExported) {
            this.trackExportedName(funcName);
        }

        this.writePunctuation("(");
        this.emitParamsList(node.parameters);
        this.writePunctuation(")");

        if (node.type) {
            const returnType = this.typeToString(node.type);
            if (returnType) {
                this.writeSpace();
                this.write(returnType);
            }
        }

        this.writeSpace();
        if (node.body) {
            this.emitBlock(node.body);
        } else {
            this.writePunctuation("{}");
        }
        this.writeLine();
        this.writeLine();
    }

    emitParameter(node: ts.ParameterDeclaration): void {
        const paramName = this.getTextOfNode(node.name);
        this.write(paramName);
        this.writeSpace();
        if (node.type) {
            if (ts.isUnionTypeNode(node.type)) {
                this.write("interface{}");
            } else {
                const typeStr = this.typeToString(node.type);
                this.write(typeStr);
            }
        } else {
            this.write("interface{}");
        }
    }

    emitParamsList(params: ts.NodeArray<ts.ParameterDeclaration> | ts.ParameterDeclaration[]): void {
        for (let i = 0; i < params.length; i++) {
            this.emitParameter(params[i]);
            if (i < params.length - 1) {
                this.writePunctuation(",");
                this.writeSpace();
            }
        }
    }

    private isConstInitializer(expr: ts.Expression): boolean {
        if (ts.isNumericLiteral(expr) || ts.isStringLiteral(expr)) return true;
        if (expr.kind === ts.SyntaxKind.TrueKeyword || expr.kind === ts.SyntaxKind.FalseKeyword) return true;
        if (expr.kind === ts.SyntaxKind.NullKeyword || expr.kind === ts.SyntaxKind.UndefinedKeyword) return true;
        if (ts.isPrefixUnaryExpression(expr)) {
            return this.isConstInitializer(expr.operand);
        }
        if (ts.isParenthesizedExpression(expr)) {
            return this.isConstInitializer(expr.expression);
        }
        if (ts.isBinaryExpression(expr)) {
            return this.isConstInitializer(expr.left) && this.isConstInitializer(expr.right);
        }
        return false;
    }

    emitVariableStatement(node: VariableStatement): void {
        for (const decl of node.declarationList.declarations) {
            const name = this.getTextOfNode(decl.name);
            const isConst = node.declarationList.flags & ts.NodeFlags.Const;

            if (isConst && decl.initializer && this.isConstInitializer(decl.initializer)) {
                this.write("const ");
                this.write(name);

                let typeStr: string | undefined;
                if (decl.type) {
                    typeStr = this.typeToString(decl.type);
                }

                if (typeStr && !decl.initializer) {
                    this.writeSpace();
                    this.write(typeStr);
                }

                if (decl.initializer) {
                    this.writeSpace();
                    this.writeOperator("=");
                    this.writeSpace();
                    this.emit(decl.initializer);
                }

                this.writeLine();
            } else {
                let typeStr: string | undefined;
                if (decl.type) {
                    typeStr = this.typeToString(decl.type);
                }

                const isUnionType = decl.type && ts.isUnionTypeNode(decl.type);
                const isAnyType = typeStr === "interface{}" || typeStr === "any";

                if (decl.initializer) {
                    if (isUnionType || isAnyType) {
                        this.write("var ");
                        this.write(name);
                        this.writeSpace();
                        this.write("interface{}");
                        this.writeSpace();
                        this.writeOperator("=");
                        this.writeSpace();
                        this.emit(decl.initializer);
                        this.writeLine();
                        this.trackInterfaceVar(name);
                    } else if (this.isInterfaceVarAccess(decl.initializer)) {
                        this.write("var ");
                        this.write(name);
                        this.writeSpace();
                        this.write("interface{}");
                        this.writeSpace();
                        this.writeOperator("=");
                        this.writeSpace();
                        this.emit(decl.initializer);
                        this.writeLine();
                        this.trackInterfaceVar(name);
                        // Check if initializer is a .Value property access on an interface var
                        if (ts.isPropertyAccessExpression(decl.initializer)) {
                            const propName = ts.isIdentifier(decl.initializer.name) ? decl.initializer.name.text : '';
                            if (propName === 'value' || propName === 'Value') {
                                this.trackValueVar(name);
                            }
                        }
                        // Check if initializer is a .Value property access on an interface var
                        if (ts.isPropertyAccessExpression(decl.initializer)) {
                            const propName = ts.isIdentifier(decl.initializer.name) ? decl.initializer.name.text : '';
                            if (propName === 'value' || propName === 'Value') {
                                this.trackValueVar(name);
                            }
                        }
                    } else {
                        this.write(name);
                        this.writeSpace();
                        this.writeOperator(":=");
                        this.writeSpace();
                        this.emit(decl.initializer);
                        this.writeLine();
                        this.write("_ = ");
                        this.write(name);
                        this.writeLine();
                    }
                } else {
                    this.write("var ");
                    this.write(name);

                    if (!typeStr) {
                        typeStr = "interface{}";
                    }

                    if (typeStr) {
                        this.writeSpace();
                        this.write(typeStr);
                    }

                    this.writeLine();
                }
            }
        }
    }

    emitVariableDeclaration(node: ts.VariableDeclaration): void {
        this.emit(node.name);
        if (node.initializer) {
            this.writeSpace();
            this.writeOperator("=");
            this.writeSpace();
            this.emit(node.initializer);
        }
    }

    emitEnumDeclaration(node: EnumDeclaration): void {
        const enumName = this.toPascalCase(this.getTextOfNode(node.name));
        const isExported = this.isExported(node);

        this.write("type ");
        if (isExported) {
            this.write(enumName);
        } else {
            this.write(enumName.charAt(0).toLowerCase() + enumName.slice(1));
        }
        this.write(" int");
        this.writeLine();
        this.writeLine();

        this.write("const (");
        this.writeLine();
        this.increaseIndent();

        for (let i = 0; i < node.members.length; i++) {
            const member = node.members[i];
            const memberName = this.getTextOfNode(member.name);

            if (isExported) {
                this.write(enumName);
                this.write(this.toPascalCase(memberName));
            } else {
                this.write(enumName.charAt(0).toLowerCase() + enumName.slice(1));
                this.write(this.toPascalCase(memberName));
            }

            if (member.initializer) {
                this.writeSpace();
                this.writeOperator("=");
                this.writeSpace();
                this.emit(member.initializer);
            } else if (i === 0) {
                this.writeSpace();
                this.writeOperator("=");
                this.writeSpace();
                this.write("iota");
            }

            this.writeLine();
        }

        this.decreaseIndent();
        this.writePunctuation(")");
        this.writeLine();
        this.writeLine();
    }

    emitInterfaceDeclaration(node: InterfaceDeclaration): void {
        const interfaceName = this.toPascalCase(this.getTextOfNode(node.name));
        const isExported = this.isExported(node);

        this.write("type ");
        if (isExported) {
            this.write(interfaceName);
        } else {
            this.write(interfaceName.charAt(0).toLowerCase() + interfaceName.slice(1));
        }
        this.write(" interface {");
        this.writeLine();
        this.increaseIndent();

        for (const member of node.members) {
            if (member.kind === ts.SyntaxKind.MethodSignature) {
                const method = member as any;
                const methodName = this.toPascalCase(this.getTextOfNode(method.name));
                this.write(methodName);
                this.writePunctuation("(");
                this.emitParamsList(method.parameters || []);
                this.writePunctuation(")");
                if (method.type) {
                    this.writeSpace();
                    this.write(this.typeToString(method.type));
                }
                this.writeLine();
            } else if (member.kind === ts.SyntaxKind.PropertySignature) {
                const prop = member as any;
                const propName = this.toPascalCase(this.getTextOfNode(prop.name));
                this.write(propName);
                this.writeSpace();
                if (prop.type) {
                    this.write(this.typeToString(prop.type));
                } else {
                    this.write("interface{}");
                }
                this.writeLine();
            }
        }

        this.decreaseIndent();
        this.writePunctuation("}");
        this.writeLine();
        this.writeLine();
    }

    emitTypeAliasDeclaration(node: TypeAliasDeclaration): void {
        const typeName = this.toPascalCase(this.getTextOfNode(node.name));
        const isExported = this.isExported(node);

        this.write("type ");
        if (isExported) {
            this.write(typeName);
        } else {
            this.write(typeName.charAt(0).toLowerCase() + typeName.slice(1));
        }
        this.writeSpace();
        this.emit(node.type);
        this.writeLine();
        this.writeLine();
    }

    emitModuleDeclaration(node: ModuleDeclaration): void {
        this.writeComment("// Module: " + this.getTextOfNode(node.name));
        this.writeLine();
        if (node.body) {
            if (node.body.kind === ts.SyntaxKind.ModuleBlock) {
                for (const stmt of (node.body as any).statements) {
                    this.emit(stmt);
                }
            }
        }
    }

    emitPropertyDeclaration(node: PropertyDeclaration): void {
        const propName = this.getTextOfNode(node.name);
        const isPrivate = node.modifiers?.some((m: any) => m.kind === ts.SyntaxKind.PrivateKeyword);

        if (isPrivate) {
            this.write(propName.charAt(0).toLowerCase() + propName.slice(1));
        } else {
            this.write(this.toPascalCase(propName));
        }

        this.writeSpace();
        if (node.type) {
            this.write(this.typeToString(node.type));
        } else {
            this.write("interface{}");
        }
    }

    emitConstructor(node: ConstructorDeclaration): void {
        // Constructor is handled in emitClassDeclaration
    }

    emitGetAccessorDeclaration(node: GetAccessorDeclaration): void {
        const className = this.getContainingClassName(node);
        const accessorName = this.toPascalCase(this.getTextOfNode(node.name));
        const returnType = node.type ? this.typeToString(node.type) : "interface{}";

        this.write("func (this *");
        this.write(className);
        this.writePunctuation(")");
        this.writeSpace();
        this.write("Get");
        this.write(accessorName);
        this.writePunctuation("()");
        this.writeSpace();
        this.write(returnType);
        this.writeSpace();
        if (node.body) {
            this.emitBlock(node.body);
        }
        this.writeLine();
        this.writeLine();
    }

    emitSetAccessorDeclaration(node: SetAccessorDeclaration): void {
        const className = this.getContainingClassName(node);
        const accessorName = this.toPascalCase(this.getTextOfNode(node.name));

        this.write("func (this *");
        this.write(className);
        this.writePunctuation(")");
        this.writeSpace();
        this.write("Set");
        this.write(accessorName);
        this.writePunctuation("(");
        if (node.parameters.length > 0) {
            const param = node.parameters[0];
            const paramName = this.getTextOfNode(param.name);
            this.write(paramName);
            this.writeSpace();
            this.write(param.type ? this.typeToString(param.type) : "interface{}");
        }
        this.writePunctuation(")");
        this.writeSpace();
        if (node.body) {
            this.emitBlock(node.body);
        }
        this.writeLine();
        this.writeLine();
    }

    emitExportDeclaration(node: ts.ExportDeclaration): void {
        // Handled at module level
    }
}
