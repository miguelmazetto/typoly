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
    ExpressionStatement,
} from "typescript";

export function StatementsMixin<TBase extends new (...args: any[]) => any>(Base: TBase) {
    class StatementsMixin extends Base {
        emitBlock(node: Block): void {
            this.writePunctuation("{");
            this.writeLine();
            this.increaseIndent();
            for (const stmt of node.statements) {
                this.emit(stmt);
                // Add semicolon after expression statements
                if (stmt.kind === ts.SyntaxKind.ExpressionStatement) {
                    this.writePunctuation(";");
                }
                this.writeLine();
            }
            this.decreaseIndent();
            this.writePunctuation("}");
        }

        emitIfStatement(node: IfStatement): void {
            this.writeKeyword("if");
            this.writeSpace();
            this.emitExpression(node.expression);
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
            // Go doesn't have do-while, use for with break
            this.emitEmbeddedStatement(node, node.statement);
            this.writeLine();
            this.writeKeyword("for");
            this.writeSpace();
            this.writePunctuation("{");
            this.writeLine();
            this.increaseIndent();
            this.writeKeyword("if");
            this.writeSpace();
            this.writeOperator("!");
            this.emitExpression(node.expression);
            this.writeSpace();
            this.writePunctuation("{ break }");
            this.writeLine();
            this.emitEmbeddedStatement(node, node.statement);
            this.decreaseIndent();
            this.writePunctuation("}");
        }

        emitForStatement(node: ForStatement): void {
            this.writeKeyword("for");
            this.writeSpace();
            
            // Init
            if (node.initializer) {
                if (node.initializer.kind === ts.SyntaxKind.VariableDeclarationList) {
                    this.emitVariableDeclarationList(node.initializer as any);
                } else {
                    this.emitExpression(node.initializer);
                }
            }
            this.writePunctuation(";");
            this.writeSpace();
            
            // Condition
            if (node.condition) {
                this.emitExpression(node.condition);
            }
            this.writePunctuation(";");
            this.writeSpace();
            
            // Post
            if (node.incrementor) {
                this.emitExpression(node.incrementor);
            }
            
            this.writeSpace();
            this.emitEmbeddedStatement(node, node.statement);
        }

        emitForInStatement(node: ForInStatement): void {
            this.writeKeyword("for");
            this.writeSpace();
            
            if (ts.isVariableDeclarationList(node.initializer)) {
                const decl = node.initializer.declarations[0];
                const varName = this.getTextOfNode(decl.name);
                this.write(varName);
            } else {
                this.emit(node.initializer);
            }
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
            
            if (ts.isVariableDeclarationList(node.initializer)) {
                const decl = node.initializer.declarations[0];
                const varName = this.getTextOfNode(decl.name);
                this.write("_");
                this.writePunctuation(",");
                this.writeSpace();
                this.write(varName);
            } else {
                this.emit(node.initializer);
            }
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
            // Go uses panic or returns error
            this.write("panic");
            this.writePunctuation("(");
            this.emitExpression(node.expression);
            this.writePunctuation(")");
        }

        emitTryStatement(node: TryStatement): void {
            // Go uses defer/recover for panic recovery
            this.writePunctuation("{");
            this.writeLine();
            this.increaseIndent();
            
            // Defer recovery if there's a catch
            if (node.catchClause) {
                this.write("defer func() {");
                this.writeLine();
                this.increaseIndent();
                this.write("if r := recover(); r != nil {");
                this.writeLine();
                this.increaseIndent();
                
                if (node.catchClause.variableDeclaration) {
                    const paramName = this.getTextOfNode(node.catchClause.variableDeclaration.name);
                    this.write(paramName);
                    this.write(" := r");
                    this.writeLine();
                }
                
                this.emit(node.catchClause.block);
                this.decreaseIndent();
                this.writePunctuation("}");
                this.writeLine();
                this.decreaseIndent();
                this.writePunctuation("}()");
                this.writeLine();
            }
            
            // Emit try block
            this.emit(node.tryBlock);
            
            this.decreaseIndent();
            this.writePunctuation("}");
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

        emitExpressionStatement(node: ExpressionStatement): void {
            this.emitExpression(node.expression);
        }
    }
    
    return StatementsMixin;
}
