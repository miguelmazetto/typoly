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
import { CppPrinterBase } from '../base';

export class DeclarationsMixin extends CppPrinterBase {
    emitClassDeclaration(node: ClassDeclaration): void {
        this.writeKeyword("class");
        this.writeSpace();
        this.emitIdentifierName(node.name!);
        
        if (node.heritageClauses) {
            for (const clause of node.heritageClauses) {
                if (clause.token === ts.SyntaxKind.ExtendsKeyword) {
                    this.writeSpace();
                    this.writePunctuation(":");
                    this.writeSpace();
                    this.emit(clause.types[0].expression);
                }
            }
        }
        
        this.writeSpace();
        this.writePunctuation("{");
        this.writeLine();
        this.increaseIndent();

        let publicMembers: ClassElement[] = [];
        let privateMembers: ClassElement[] = [];
        let protectedMembers: ClassElement[] = [];
        
        for (const member of node.members) {
            let visibility = "public";
            const modifiers = this._getModifiers(member);
            if (modifiers) {
                if (modifiers.some((m: any) => m.kind === ts.SyntaxKind.PrivateKeyword)) visibility = "private";
                else if (modifiers.some((m: any) => m.kind === ts.SyntaxKind.ProtectedKeyword)) visibility = "protected";
            }
            switch (visibility) {
                case "public": publicMembers.push(member); break;
                case "private": privateMembers.push(member); break;
                case "protected": protectedMembers.push(member); break;
            }
        }
        
        const constructor = node.members.find(m => m.kind === ts.SyntaxKind.Constructor) as ts.ConstructorDeclaration;
        if (constructor && constructor.parameters) {
            for (const param of constructor.parameters) {
                const paramMods = this._getModifiers(param);
                if (paramMods && param.type) {
                    let visibility = "public";
                    if (paramMods.some((m: any) => m.kind === ts.SyntaxKind.PrivateKeyword)) visibility = "private";
                    else if (paramMods.some((m: any) => m.kind === ts.SyntaxKind.ProtectedKeyword)) visibility = "protected";
                    
                    const fakeMember: any = {
                        kind: ts.SyntaxKind.PropertyDeclaration,
                        name: param.name,
                        type: param.type,
                        modifiers: paramMods
                    };
                    switch (visibility) {
                        case "public": publicMembers.push(fakeMember); break;
                        case "private": privateMembers.push(fakeMember); break;
                        case "protected": protectedMembers.push(fakeMember); break;
                    }
                }
            }
        }

        const emitSection = (members: ClassElement[], label: string) => {
            if (members.length === 0) return;
            this.writeKeyword(label);
            this.writePunctuation(":");
            this.writeLine();
            this.increaseIndent();
            for (const member of members) {
                this.emit(member);
                this.writeLine();
            }
            this.decreaseIndent();
        };

        emitSection(publicMembers, "public");
        emitSection(protectedMembers, "protected");
        emitSection(privateMembers, "private");

        this.decreaseIndent();
        this.writePunctuation("}");
        this.writeTrailingSemicolon();
    }

    emitFunctionDeclaration(node: FunctionDeclaration): void {
        if (node.typeParameters && node.typeParameters.length > 0) {
            this.writeKeyword("template");
            this.writePunctuation("<");
            for (let i = 0; i < node.typeParameters.length; i++) {
                const tp = node.typeParameters[i];
                this.writeKeyword("typename");
                this.writeSpace();
                this.emit(tp.name);
                if (i < node.typeParameters.length - 1) {
                    this.writePunctuation(",");
                    this.writeSpace();
                }
            }
            this.writePunctuation(">");
            this.writeLine();
        }
        const returnType = node.type ? this.typeToString(node.type) : "void";
        this.write(returnType);
        this.writeSpace();
        this.emitIdentifierName(node.name!);
        this.writePunctuation("(");
        this.emitParamsList(node.parameters);
        this.writePunctuation(")");
        if (node.body) {
            this.writeSpace();
            this.emitBlock(node.body);
        } else {
            this.writeTrailingSemicolon();
        }
    }

    emitEnumDeclaration(node: EnumDeclaration): void {
        this.writeKeyword("enum");
        this.writeSpace();
        this.writeKeyword("class");
        this.writeSpace();
        this.emit(node.name);
        this.writeSpace();
        this.writePunctuation("{");
        this.writeLine();
        this.increaseIndent();
        for (let i = 0; i < node.members.length; i++) {
            const member = node.members[i];
            this.emit(member.name);
            if (member.initializer) {
                this.writeSpace();
                this.writeOperator("=");
                this.writeSpace();
                this.emit(member.initializer);
            }
            if (i < node.members.length - 1) {
                this.writePunctuation(",");
                this.writeLine();
            } else {
                this.writeLine();
            }
        }
        this.decreaseIndent();
        this.writePunctuation("}");
        this.writeTrailingSemicolon();
        this.writeLine();
    }

    emitInterfaceDeclaration(node: InterfaceDeclaration): void {
        this.writeKeyword("struct");
        this.writeSpace();
        this.emit(node.name);
        
        if (node.heritageClauses) {
            for (const clause of node.heritageClauses) {
                if (clause.token === ts.SyntaxKind.ExtendsKeyword) {
                    this.writeSpace();
                    this.writePunctuation(":");
                    this.writeSpace();
                    for (let i = 0; i < clause.types.length; i++) {
                        this.emit(clause.types[i].expression);
                        if (i < clause.types.length - 1) {
                            this.writePunctuation(",");
                            this.writeSpace();
                        }
                    }
                }
            }
        }
        
        this.writeSpace();
        this.writePunctuation("{");
        this.writeLine();
        this.increaseIndent();
        
        for (const member of node.members) {
            if (member.kind === ts.SyntaxKind.MethodSignature) {
                const method = member as any;
                const returnType = method.type ? this.typeToString(method.type) : "void";
                this.write(returnType);
                this.writeSpace();
                this.emit(method.name);
                this.writePunctuation("(");
                this.emitParamsList(method.parameters || []);
                this.writePunctuation(")");
                this.writePunctuation(";");
                this.writeLine();
            } else if (member.kind === ts.SyntaxKind.PropertySignature) {
                const prop = member as any;
                const typeStr = prop.type ? this.typeToString(prop.type) : "auto";
                this.write(typeStr);
                this.writeSpace();
                this.emit(prop.name);
                this.writePunctuation(";");
                this.writeLine();
            }
        }
        
        this.decreaseIndent();
        this.writePunctuation("}");
        this.writeTrailingSemicolon();
        this.writeLine();
    }

    emitTypeAliasDeclaration(node: TypeAliasDeclaration): void {
        this.writeKeyword("using");
        this.writeSpace();
        this.emit(node.name);
        this.writeSpace();
        this.writeOperator("=");
        this.writeSpace();
        this.emit(node.type);
        this.writePunctuation(";");
        this.writeLine();
    }

    emitModuleDeclaration(node: ModuleDeclaration): void {
        this.writeKeyword("namespace");
        this.writeSpace();
        this.emit(node.name);
        this.writeSpace();
        this.writePunctuation("{");
        this.writeLine();
        this.increaseIndent();
        if (node.body) {
            if (node.body.kind === ts.SyntaxKind.ModuleBlock) {
                for (const stmt of (node.body as any).statements) {
                    this.emit(stmt);
                    this.writeLine();
                }
            } else if (node.body.kind === ts.SyntaxKind.ModuleDeclaration) {
                this.emit(node.body);
            }
        }
        this.decreaseIndent();
        this.writePunctuation("}");
        this.writeLine();
    }

    emitVariableStatement(node: VariableStatement): void {
        for (const decl of node.declarationList.declarations) {
            const name = decl.name;
            if (name.kind === ts.SyntaxKind.Identifier) {
                const id = name as ts.Identifier;
                
                let typeStr: string | undefined;
                
                // First check for 'new' expressions - extract constructor name as type
                if (decl.initializer && ts.isNewExpression(decl.initializer)) {
                    const newExpr = decl.initializer;
                    if (ts.isIdentifier(newExpr.expression)) {
                        typeStr = newExpr.expression.text;
                    }
                }
                
                // If not a new expression, try type inference
                if (!typeStr && this.typeChecker && decl.initializer) {
                    try {
                        const type = this.typeChecker.getTypeAtLocation(decl);
                        if (type && !(type.flags & ts.TypeFlags.Any)) {
                            typeStr = this.typeChecker.typeToString(type, decl);
                            if (typeStr !== "any" && typeStr !== "" && typeStr !== "{}") {
                                typeStr = this.mapInferredType(typeStr);
                            } else {
                                typeStr = undefined;
                            }
                        }
                    } catch {
                        typeStr = undefined;
                    }
                }
                
                // If type inference still failed and initializer is a call expression with a known constructor name
                if (!typeStr && decl.initializer && ts.isCallExpression(decl.initializer)) {
                    const callExpr = decl.initializer;
                    if (ts.isIdentifier(callExpr.expression)) {
                        const funcName = callExpr.expression.text;
                        const constructorNames = ["RegExp", "Date", "Buffer", "ArrayBuffer", 
                            "DataView", "TextEncoder", "TextDecoder"];
                        if (constructorNames.includes(funcName)) {
                            typeStr = funcName;
                        }
                    }
                }
                
                // Use auto if no type found or type is empty
                if (typeStr && typeStr !== "" && typeStr !== "{}") {
                    this.write(typeStr);
                } else {
                    this.writeKeyword("auto");
                }
                this.writeSpace();
                this.emitIdentifier(id);
                
                const modifiers = this._getModifiers(node);
                if (modifiers && modifiers.some((m: any) => m.kind === ts.SyntaxKind.ConstKeyword)) {
                    this.writeSpace();
                    this.writeKeyword("const");
                }
                
                if (decl.initializer) {
                    this.writeSpace();
                    this.writeOperator("=");
                    this.writeSpace();
                    this.emit(decl.initializer);
                }
                this.writePunctuation(";");
                this.writeLine();
            }
        }
    }

    emitPropertyDeclaration(node: PropertyDeclaration): void {
        if (node.modifiers && node.modifiers.some((m: any) => m.kind === ts.SyntaxKind.StaticKeyword)) {
            this.writeKeyword("static");
            this.writeSpace();
        }
        const typeStr = node.type ? this.typeToString(node.type) : "auto";
        this.write(typeStr);
        this.writeSpace();
        this.emit(node.name);
        if (node.initializer) {
            this.writeSpace();
            this.writeOperator("=");
            this.writeSpace();
            this.emit(node.initializer);
        }
        this.writePunctuation(";");
    }

    emitMethodDeclaration(node: MethodDeclaration): void {
        if (node.typeParameters && node.typeParameters.length > 0) {
            this.writeKeyword("template");
            this.writePunctuation("<");
            for (let i = 0; i < node.typeParameters.length; i++) {
                const tp = node.typeParameters[i];
                this.writeKeyword("typename");
                this.writeSpace();
                this.emit(tp.name);
                if (i < node.typeParameters.length - 1) {
                    this.writePunctuation(",");
                    this.writeSpace();
                }
            }
            this.writePunctuation(">");
            this.writeLine();
        }
        if (node.modifiers && node.modifiers.some((m: any) => m.kind === ts.SyntaxKind.StaticKeyword)) {
            this.writeKeyword("static");
            this.writeSpace();
        }
        const returnType = node.type ? this.typeToString(node.type) : "void";
        this.write(returnType);
        this.writeSpace();
        this.emit(node.name);
        this.writePunctuation("(");
        this.emitParamsList(node.parameters);
        this.writePunctuation(")");
        if (node.body) {
            this.writeSpace();
            this.emitBlock(node.body);
        } else {
            this.writePunctuation(";");
        }
    }

    emitConstructor(node: ConstructorDeclaration): void {
        const className = this.getContainingClassName(node);
        const allParams = Array.from(node.parameters || []);
        
        this.write(className);
        this.writePunctuation("(");
        this.emitParamsList(allParams);
        this.writePunctuation(")");
        
        if (node.body) {
            this.writeSpace();
            this.writePunctuation("{");
            this.writeLine();
            this.increaseIndent();
            
            for (const param of allParams) {
                const paramName = param.name;
                const paramMods = this._getModifiers(param);
                
                if (paramName.kind === ts.SyntaxKind.Identifier && paramMods && paramMods.length > 0) {
                    const name = (paramName as ts.Identifier).text;
                    this.write("this->");
                    this.write(name);
                    this.writeSpace();
                    this.writeOperator("=");
                    this.writeSpace();
                    this.write(name);
                    this.writePunctuation(";");
                    this.writeLine();
                }
            }
            
            for (const stmt of node.body.statements) {
                this.emit(stmt);
                this.writeLine();
            }
            
            this.decreaseIndent();
            this.writePunctuation("}");
        } else {
            this.writePunctuation(";");
        }
    }

    emitGetAccessorDeclaration(node: GetAccessorDeclaration): void {
        const returnType = node.type ? this.typeToString(node.type) : "auto";
        this.write(returnType);
        this.writeSpace();
        this.emit(node.name);
        this.writePunctuation("(");
        this.writePunctuation(")");
        if (node.body) {
            this.writeSpace();
            this.emitBlock(node.body);
        } else {
            this.writePunctuation(";");
        }
    }

    emitSetAccessorDeclaration(node: SetAccessorDeclaration): void {
        const param = node.parameters[0];
        const paramType = param.type ? this.typeToString(param.type) : "auto";
        this.write("void");
        this.writeSpace();
        this.emit(node.name);
        this.writePunctuation("(");
        this.write(paramType);
        this.writeSpace();
        this.emit(param.name);
        this.writePunctuation(")");
        if (node.body) {
            this.writeSpace();
            this.emitBlock(node.body);
        } else {
            this.writePunctuation(";");
        }
    }

    emitExportDeclaration(node: ts.ExportDeclaration): void {
        // Handled at module level
    }

    emitParamDecl(node: ts.ParameterDeclaration): void {
        const paramType = node.type ? this.typeToString(node.type) : "auto";
        this.write(paramType);
        this.writeSpace();
        this.emit(node.name);
        if (node.initializer) {
            this.writeSpace();
            this.writeOperator("=");
            this.writeSpace();
            this.emit(node.initializer);
        }
    }

    emitParamsList(params: ts.NodeArray<ts.ParameterDeclaration> | ts.ParameterDeclaration[]): void {
        for (let i = 0; i < params.length; i++) {
            this.emitParamDecl(params[i]);
            if (i < params.length - 1) {
                this.writePunctuation(",");
                this.writeSpace();
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
}
