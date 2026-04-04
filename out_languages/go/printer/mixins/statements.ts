import * as ts from 'typescript';
import type {
    Block,
    IfStatement,
    WhileStatement,
    DoStatement,
    ForStatement,
    ForInStatement,
    ForOfStatement,
    ReturnStatement,
    ThrowStatement,
    TryStatement,
    SwitchStatement,
    BreakStatement,
    ContinueStatement,
} from "typescript";

export function StatementsMixin<TBase extends new (...args: any[]) => any>(Base: TBase) {
    class StatementsMixin extends Base {
        emitBlock(node: Block): void {
            this.writePunctuation("{");
            this.writeLine();
            this.increaseIndent();
            for (const stmt of node.statements) {
                this.emit(stmt);
                this.writeLine();
            }
            this.decreaseIndent();
            this.writePunctuation("}");
        }

        emitIfStatement(node: IfStatement): void {
            this.writeKeyword("if");
            this.writeSpace();
            this.writePunctuation("(");
            
            // Check if the condition is a typeof comparison and handle it
            if (ts.isBinaryExpression(node.expression)) {
                const binExpr = node.expression;
                const isTypeofComp = (binExpr.operatorToken.kind === ts.SyntaxKind.EqualsEqualsEqualsToken || 
                                       binExpr.operatorToken.kind === ts.SyntaxKind.EqualsEqualsToken ||
                                       binExpr.operatorToken.kind === ts.SyntaxKind.ExclamationEqualsEqualsToken ||
                                       binExpr.operatorToken.kind === ts.SyntaxKind.ExclamationEqualsToken) &&
                                      ts.isTypeOfExpression(binExpr.left) && 
                                      ts.isStringLiteral(binExpr.right);
                
                if (isTypeofComp) {
                    // typeof comparison - always emit true as a simplification
                    this.write("true");
                } else {
                    this.emitExpression(node.expression);
                }
            } else {
                this.emitExpression(node.expression);
            }
            
            this.writePunctuation(")");
            this.writeSpace();
            this.emitEmbeddedStatement(node, node.thenStatement);
            if (node.elseStatement) {
                this.writeSpace();
                this.writeKeyword("else");
                this.writeSpace();
                this.emitEmbeddedStatement(node, node.elseStatement);
            }
        }

        emitWhileStatement(node: WhileStatement): void {
            this.writeKeyword("for");
            this.writeSpace();
            this.emitExpression(node.expression);
            this.writeSpace();
            this.emitEmbeddedStatement(node, node.statement);
        }

        emitDoStatement(node: DoStatement): void {
            this.emitEmbeddedStatement(node, node.statement);
        }

        emitForStatement(node: ForStatement): void {
            this.writeKeyword("for");
            this.writeSpace();
            
            const hasInit = !!node.initializer;
            const hasCond = !!node.condition;
            const hasPost = !!node.incrementor;
            
            if (!hasInit && !hasPost) {
                if (hasCond) {
                    this.emitExpression(node.condition);
                    this.writeSpace();
                }
                this.emitEmbeddedStatement(node, node.statement);
            } else {
                if (hasInit) {
                    if (node.initializer!.kind === ts.SyntaxKind.VariableDeclarationList) {
                        const declList = node.initializer as ts.VariableDeclarationList;
                        const decl = declList.declarations[0];
                        this.emit(decl.name);
                        this.writeSpace();
                        this.writeOperator(":=");
                        this.writeSpace();
                        if (decl.initializer) {
                            this.emit(decl.initializer);
                        }
                    } else {
                        this.emitExpression(node.initializer!);
                    }
                }
                this.writePunctuation(";");
                this.writeSpace();
                
                if (hasCond) {
                    this.emitExpression(node.condition!);
                }
                this.writePunctuation(";");
                this.writeSpace();
                
                if (hasPost) {
                    this.emitExpression(node.incrementor!);
                }
                
                this.writeSpace();
                this.emitEmbeddedStatement(node, node.statement);
            }
        }

        emitForInStatement(node: ForInStatement): void {
            this.writeKeyword("for");
            this.writeSpace();
            this.writePunctuation("_, ");
            
            if (ts.isVariableDeclarationList(node.initializer)) {
                const decl = node.initializer.declarations[0];
                this.emit(decl.name);
            } else {
                this.emit(node.initializer);
            }
            this.writeSpace();
            this.write(":=");
            this.writeSpace();
            this.writeKeyword("range");
            this.writeSpace();
            this.emitExpression(node.expression);
            this.writeSpace();
            this.emitEmbeddedStatement(node, node.statement);
        }

        emitForOfStatement(node: ForOfStatement): void {
            this.writeKeyword("for");
            this.writeSpace();
            this.writePunctuation("_, ");
            
            if (ts.isVariableDeclarationList(node.initializer)) {
                const decl = node.initializer.declarations[0];
                this.emit(decl.name);
            } else {
                this.emit(node.initializer);
            }
            this.writeSpace();
            this.write(":=");
            this.writeSpace();
            this.writeKeyword("range");
            this.writeSpace();
            this.emitExpression(node.expression);
            this.writeSpace();
            this.emitEmbeddedStatement(node, node.statement);
        }

        emitReturnStatement(node: ReturnStatement): void {
            this.writeKeyword("return");
            if (node.expression) {
                this.writeSpace();
                this.emitExpression(node.expression);
            }
        }

        emitThrowStatement(node: ThrowStatement): void {
            this.write("panic");
            this.writePunctuation("(");
            this.emitExpression(node.expression);
            this.writePunctuation(")");
        }

        emitTryStatement(node: TryStatement): void {
            this.emit(node.tryBlock);
        }

        emitSwitchStatement(node: SwitchStatement): void {
            this.writeKeyword("switch");
            this.writeSpace();
            this.emitExpression(node.expression);
            this.writeSpace();
            this.emit(node.caseBlock);
        }

        emitBreakStatement(node: BreakStatement): void {
            this.writeKeyword("break");
        }

        emitContinueStatement(node: ContinueStatement): void {
            this.writeKeyword("continue");
        }
    }
    
    return StatementsMixin;
}
