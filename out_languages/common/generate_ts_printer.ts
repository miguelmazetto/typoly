import { copyFileSync, existsSync, readFileSync, writeFileSync, constants as fsconst } from 'fs';
import * as fsp from 'fs/promises'
import { fileURLToPath } from 'url';
import * as ts from 'typescript'
import { dirname, join } from 'path';

const factory = ts.factory;

//function resolve(s: string){
//    return fileURLToPath(import.meta.resolve(s))
//}

// true = factory
// false = function
let transformer_whitelist: Record<string, boolean> = {
    createPrinter: true
}

function isBindingPattern(v: ts.Node): v is ts.BindingPattern {
    return ts.isObjectBindingPattern(v) || ts.isArrayBindingPattern(v)
}

namespace bindHandle {
    function processBindPattern(node: ts.BindingPattern): ts.Identifier[]{
        return ts.isObjectBindingPattern(node)
            ? processObjBindPattern(node)
            : processArrBindPattern(node)
    }
    function processObjBindPattern(node: ts.ObjectBindingPattern){
        return node.elements.map(v =>
            ts.isIdentifier(v.name)
            ? v.name
            : processBindPattern(v.name)).flat()
    }
    function processArrBindPattern(node: ts.ArrayBindingPattern){
        return node.elements.map(v =>
            ts.isBindingElement(v)
            ? (ts.isIdentifier(v.name)
                ? v.name
                : processBindPattern(v.name))
            : null
            ).flat().filter(Boolean) as ts.Identifier[]
    }
    function processBindName(name: ts.BindingName){
        if(ts.isIdentifier(name)){
            return [name.text]
        }else if(isBindingPattern(name)){
            return processBindPattern(name).flat().map(v => v.text)
        }
    }
}

// Transformer function
function factoryToClassTransformer<T extends ts.Node>(context: ts.TransformationContext): ts.Transformer<T> {
    const visit: ts.Visitor = (node) => {
        // Check if the node is a function declaration starting with "create"
        let wl;
        if (ts.isFunctionDeclaration(node) && node.name &&
            (wl = transformer_whitelist[node.name.text]) !== undefined
        ) {
            const className = 'RawTypescriptPrinter';
            let args: string[] = [];
            let ret: string | undefined;
            if(!wl){
                ret = (node.body!.statements.find(s => ts.isReturnStatement(s))!
                    .expression as ts.Identifier).text
            }
            return [
                factory.createFunctionDeclaration(
                    node.modifiers?.find(v => v.kind === ts.SyntaxKind.ExportKeyword)
                     ? node.modifiers
                     : [...(node.modifiers??[]), factory.createModifier(ts.SyntaxKind.ExportKeyword)],
                    node.asteriskToken, node.name, node.typeParameters,
                    node.parameters.map((p, i) =>
                        isBindingPattern(p.name)
                         ? factory.createParameterDeclaration(
                            p.modifiers, p.dotDotDotToken,
                            factory.createIdentifier(args[i] = '_arg'+i),
                            p.questionToken, p.type, p.initializer
                           )
                         : (args[i] = p.name.text, p)),
                    node.type,
                    factory.createBlock(wl ? [ // return class
                        factory.createReturnStatement(
                            factory.createNewExpression(
                                factory.createIdentifier(className),
                                undefined,
                                args.map(factory.createIdentifier).concat([factory.createIdentifier('extra')])
                              ),
                        )
                    ] : [ // return function
                        factory.createVariableStatement(
                            undefined,
                            factory.createVariableDeclarationList(
                              [factory.createVariableDeclaration(
                                factory.createIdentifier("c"),
                                undefined,
                                undefined,
                                factory.createNewExpression(
                                  factory.createIdentifier(className),
                                  undefined,
                                  args.map(factory.createIdentifier)
                                )
                              )],
                              ts.NodeFlags.Const
                            )
                        ),
                        factory.createReturnStatement(factory.createCallExpression(
                            factory.createPropertyAccessExpression(
                              factory.createPropertyAccessExpression(
                                factory.createIdentifier("c"),
                                factory.createIdentifier(ret!)
                              ),
                              factory.createIdentifier("bind")
                            ),
                            undefined,
                            [factory.createIdentifier("c")]
                        )),
                    ], true)
                ),
                transformFactoryToClass(node, className),
            ];
        } else if (ts.isVariableDeclaration(node) && node.initializer && ts.isFunctionExpression(node.initializer) &&
                   node.name && ts.isIdentifier(node.name) && node.name.text.startsWith('create')) {
            const className = 'RawTypescriptPrinter';
            return transformFactoryVariableToClass(node, className);
        }

        return ts.visitEachChild(node, visit, context);
    };

    return (node: T) => ts.visitNode(node, visit) as T;
}

function addThisTransformer<T extends ts.Node>(context: ts.TransformationContext): ts.Transformer<T> {
    function visit(node: ts.Node){
        if (ts.isClassDeclaration(node)) {
            const classPropertiesAndMethods = new Map(
                node.members
                    .map(member => {
                        if(ts.isPropertyDeclaration(member) || ts.isMethodDeclaration(member)){
                            if(ts.isComputedPropertyName(member.name))
                                throw 'help'
                            else
                                return [[(member.name as ts.Identifier).text, ts.isMethodDeclaration(member)]];
                        }
                        
                        if(ts.isConstructorDeclaration(member))
                            return getVariablesInScope(member, true).map(v => [v, false])
                        else if(ts.isMethodDeclaration(member) && member.name && ts.isIdentifier(member.name))
                            return getVariablesInScope(member).map(v => [v, false])
                        
                        return null
                    })
                    .flat(1)
                    .filter(Boolean) as [string, boolean][] // Filter out nulls
            );
            const updatedBody = node.members.map(member => addThisToMembers(member, classPropertiesAndMethods));
            return ts.factory.updateClassDeclaration(
                node, node.modifiers, node.name, node.typeParameters, node.heritageClauses, updatedBody as ts.ClassElement[]
            );
        }
        return ts.visitEachChild(node, visit, undefined)
    }

    return (node: T) => ts.visitNode(node, visit) as T;
}

// Create constructor with parameters
function createConstructor(node: ts.FunctionExpression | ts.FunctionDeclaration, constructorStatements: ts.Statement[]){
    return [
        // Add as properties
        ...node.parameters.map(p => factory.createPropertyDeclaration(
            [factory.createModifier(ts.SyntaxKind.PublicKeyword), ...(p.modifiers ?? [])],
            p.name as ts.Identifier, p.questionToken, p.type, p.initializer
        )),
        factory.createMethodDeclaration(
            undefined,
            undefined,
            factory.createIdentifier("constructor"),
            undefined,
            undefined,
            node.parameters.map(p => ts.factory.createParameterDeclaration(
                (p.modifiers??([] as unknown as ts.NodeArray<ts.ModifierLike>))/*.concat([factory.createModifier(ts.SyntaxKind.PublicKeyword)])*/, p.dotDotDotToken,
                '__'+(p.name as ts.Identifier).text,
                p.questionToken, p.type, p.initializer
            )).concat([factory.createParameterDeclaration(
                [factory.createModifier(ts.SyntaxKind.PublicKeyword)],
                undefined,
                'extra',
                undefined,
                factory.createTypeReferenceNode(factory.createIdentifier('EmitterExtraContext'))
            )]),
            undefined,
            factory.createBlock(
                [
                    ...node.parameters.map(p => factory.createExpressionStatement(factory.createBinaryExpression(
                        factory.createPropertyAccessExpression(
                          factory.createThis(),
                          p.name as ts.Identifier
                        ),
                        factory.createToken(ts.SyntaxKind.EqualsToken),
                        factory.createIdentifier('__'+(p.name as ts.Identifier).text)
                    ))),
                    ...constructorStatements,
                    factory.createReturnStatement(factory.createThis())
                ],
              true
            )
        )
    ]
}

// Helper function to transform factory function to class
function transformFactoryToClass(node: ts.FunctionDeclaration, className: string) {
    let classMembers: ts.ClassElement[] = [];
    let constructorStatements: ts.Statement[] = [];

    if (node.body) {
        const { properties, methods, statements } = extractClassElementsFromBody(node.body);
        constructorStatements = statements;
        classMembers = [...properties, ...methods];
    }

    // Return class declaration
    return ts.factory.createClassDeclaration(
        [ts.factory.createModifier(ts.SyntaxKind.ExportKeyword)],
        ts.factory.createIdentifier(className),
        undefined,
        undefined,
        [...createConstructor(node, constructorStatements), ...classMembers]
    );
}

// Helper function to transform factory variable to class
function transformFactoryVariableToClass(node: ts.VariableDeclaration, className: string): ts.ClassDeclaration {
    if (!ts.isFunctionExpression(node.initializer!)) {
        throw new Error('Initializer is not a function expression');
    }

    let classMembers: ts.ClassElement[] = [];
    let constructorStatements: ts.Statement[] = [];

    if (node.initializer.body) {
        const { properties, methods, statements } = extractClassElementsFromBody(node.initializer.body);
        constructorStatements = statements;
        classMembers = [...properties, ...methods];
    }

    // Return class declaration
    return ts.factory.createClassDeclaration(
        [ts.factory.createModifier(ts.SyntaxKind.ExportKeyword)],
        ts.factory.createIdentifier(className),
        undefined,
        undefined,
        [...createConstructor(node.initializer, constructorStatements), ...classMembers]
    );
}

// Extract properties and methods from the body of the factory function
function extractClassElementsFromBody(body: ts.Block) {
    const properties: ts.PropertyDeclaration[] = [];
    const methods: ts.MethodDeclaration[] = [];
    const statements: ts.Statement[] = [];

    body.statements.forEach(statement => {
        if (ts.isVariableStatement(statement)) {
            // Convert variables to class properties
            statement.declarationList.declarations.forEach(declaration => {
                if (ts.isIdentifier(declaration.name)) {
                    const property = ts.factory.createPropertyDeclaration(
                        [],
                        declaration.name,
                        undefined,
                        declaration.type,
                        declaration.initializer
                    );
                    properties.push(property);
                }else{
                    function processBindPattern(node: ts.BindingPattern, exp: ts.Expression): ts.PropertyDeclaration[]{
                        return ts.isObjectBindingPattern(node)
                            ? processObjBindPattern(node, exp)
                            : processArrBindPattern(node, exp)
                    }
                    function processObjBindPattern(node: ts.ObjectBindingPattern, exp: ts.Expression){
                        return node.elements.map(v => {
                            const name = v.propertyName ?? (v.name as ts.Identifier)

                            const acc = ts.isIdentifier(name) || ts.isPrivateIdentifier(name)
                            ? ts.factory.createPropertyAccessExpression(exp, name)
                            : (
                                ts.isComputedPropertyName(name)
                                ? ts.factory.createElementAccessExpression(exp, name.expression)
                                : ts.factory.createElementAccessExpression(exp, name)
                            )
                            
                            return isBindingPattern(v.name)
                                ? processBindPattern(v.name, acc)
                                : ts.factory.createPropertyDeclaration(
                                    [],
                                    v.name,
                                    undefined,
                                    undefined,
                                    v.initializer
                                     ? ts.factory.createBinaryExpression(
                                        acc,
                                        ts.factory.createToken(ts.SyntaxKind.QuestionQuestionToken),
                                        v.initializer)
                                     : acc
                                )
                        }).flat()
                    }
                    function processArrBindPattern(node: ts.ArrayBindingPattern, exp: ts.Expression){
                        return node.elements.map((v: ts.ArrayBindingElement, i: number) => {
                            const acc = ts.factory.createElementAccessExpression(
                                exp,
                                ts.factory.createNumericLiteral(i)
                            )
                            return ts.isBindingElement(v)
                                ? (ts.isIdentifier(v.name)
                                    ? ts.factory.createPropertyDeclaration(
                                        [],
                                        v.name,
                                        undefined,
                                        undefined,
                                        acc
                                    )
                                    : processBindPattern(v.name, acc))
                                : null
                        }).flat().filter(Boolean) as ts.PropertyDeclaration[]
                    }
                    properties.push(...processBindPattern(declaration.name, declaration.initializer!))
                }
            });
        } else if (ts.isFunctionLike(statement)) {
            const method = ts.factory.createMethodDeclaration(
                [ts.factory.createModifier(ts.SyntaxKind.PublicKeyword)],
                undefined,
                statement.name ?? 'unnamed',
                undefined,
                statement.typeParameters,
                statement.parameters,
                statement.type,
                statement.body
            );
            methods.push(method);
        } else if(ts.isReturnStatement(statement)) {
            /* nothing */
        } else {
            statements.push(statement)
        }
    });

    return { properties, methods, statements };
}

function synt(n?: ts.Node): string|undefined{
    // @ts-ignore
    return n ? ts.SyntaxKind[n.kind]+(n.name ? `(${(() => {try{return n.name.getText()}catch(e){return 'error'}})()})`
    : '') : undefined;
}


// Helper to collect variable names in the current scope
function getVariablesInScope(scopeNode: ts.Block | ts.FunctionLikeDeclaration, skipBody: boolean = false
): string[] {
    const variables: string[] = [];

    function visitor(node: ts.Node){
        //console.log('getVariablesInScopeVisitor', synt(node))

        function processBindPattern(node: ts.BindingPattern): ts.Identifier[]{
            return ts.isObjectBindingPattern(node)
                ? processObjBindPattern(node)
                : processArrBindPattern(node)
        }
        function processObjBindPattern(node: ts.ObjectBindingPattern){
            return node.elements.map(v =>
                ts.isIdentifier(v.name)
                ? v.name
                : processBindPattern(v.name)).flat()
        }
        function processArrBindPattern(node: ts.ArrayBindingPattern){
            return node.elements.map(v =>
                ts.isBindingElement(v)
                ? (ts.isIdentifier(v.name)
                    ? v.name
                    : processBindPattern(v.name))
                : null
                ).flat().filter(Boolean) as ts.Identifier[]
        }
        function processBindName(name: ts.BindingName){
            if(ts.isIdentifier(name)){
                variables.push(name.text)
            }else if(isBindingPattern(name)){
                processBindPattern(name).flat().forEach(v =>
                    variables.push(v.text))
            }
        }

        if(ts.isVariableStatement(node)){
            node.declarationList.declarations.forEach(d => processBindName(d.name))
        }else if(ts.isVariableDeclaration(node) || ts.isParameter(node)){
            processBindName(node.name)
        }else if(ts.isFunctionLike(node) && node.name && ts.isIdentifier(node.name)){
            variables.push(node.name.text)
        }
        else{
            let s = synt(node)
            if(!s?.includes('Statement')){
                console.log('skipped', s)
            }
        }
    }

    if(ts.isFunctionLike(scopeNode)){
        scopeNode.parameters.forEach(visitor)
        //if(ts.isMethodDeclaration(scopeNode) && ts.isIdentifier(scopeNode.name) && scopeNode.name.text === 'constructor'){
        //    console.log('CONSTRUCTOR DECL')
        //}
        if(!skipBody && scopeNode.body && ts.isBlock(scopeNode.body))
            scopeNode.body.statements.forEach(visitor)
    }else
        scopeNode.statements.forEach(visitor)
    
    return variables;
}

function dbgnode(node: ts.Node){
    // @ts-ignore
    console.log(node.parent?.parent && ts.SyntaxKind[node.parent.parent.kind], node.parent && ts.SyntaxKind[node.parent.kind], ts.SyntaxKind[node.kind])
}

// Helper function to add "this." to property and method usages
function addThisToMembers(node: ts.Node, classPropertiesAndMethods: Map<string, boolean>) {

    let copy_this = false;
    let in_fun_decl = false;

    let scope: string[] = [];

    // Visitor to add "this." if needed
    const visitor = (node: ts.Node): ts.Node => {
        let isMethod: boolean | undefined;
        if(ts.isPropertyDeclaration(node))
            return ts.factory.createPropertyDeclaration(
                node.modifiers, node.name,
                node.initializer
                 ? node.questionToken
                 : ts.factory.createToken(ts.SyntaxKind.ExclamationToken),
                node.type,
                node.initializer
                 ? visitor(node.initializer) as ts.Expression
                 : undefined)
        else if(ts.isPropertyAccessExpression(node))
            return ts.factory.createPropertyAccessChain(
                visitor(node.expression) as ts.Expression, node.questionDotToken, node.name)
        else if(ts.isShorthandPropertyAssignment(node))
            return ts.factory.createPropertyAssignment(node.name, visitor(node.name) as ts.Expression)
        else if(ts.isIdentifier(node) &&
            node.parent?.parent &&
            //!ts.isPropertyAccessExpression(node.parent) &&
            //(!ts.isPropertyAccessExpression(node.parent) || node.parent.expression.id === node.id) &&
            (!ts.isParameter(node.parent) || node.parent.initializer === node) &&
            !ts.isFunctionDeclaration(node.parent) &&
            (!ts.isVariableDeclaration(node.parent) || node.parent.initializer === node) &&
            (isMethod = classPropertiesAndMethods.get(node.text)) !== undefined
        ){
            // @ts-ignore
            // console.log(node.text, ts.SyntaxKind[node.parent.parent.kind], ts.SyntaxKind[node.parent.kind])

            if(!isShadowed(node, scope)){
                //console.log(node.text, 'isMethod =', isMethod)
                const _this = in_fun_decl ? factory.createIdentifier('this_') : factory.createThis()
                let ret = factory.createPropertyAccessExpression(_this, node)
                if(isMethod && !(
                    (ts.isCallExpression(node.parent) && node.parent.expression === node)
                    || (ts.isBinaryExpression(node.parent)
                        && node.parent.operatorToken.kind === ts.SyntaxKind.EqualsToken
                        && node.parent.left === node)
                    || ts.isTypeQueryNode(node.parent)
                )){
                    (ret as ts.Node) = factory.createCallChain(
                        factory.createPropertyAccessChain(
                            ret,
                            factory.createToken(ts.SyntaxKind.QuestionDotToken),
                            factory.createIdentifier('bind')),
                        factory.createToken(ts.SyntaxKind.QuestionDotToken),
                        undefined,
                        [_this]
                    )
                }
                return ret
            }
            return node
        }else if(ts.isBlock(node)){
            const vars = getVariablesInScope(node)
            const vars_pushed = vars.length
            scope.push(...vars)

            const ret = ts.visitEachChild(node, visitor, undefined);

            if(vars_pushed != 0)
                scope.splice(scope.length-vars_pushed, vars_pushed)
            return ret;
        }else if(ts.isMethodDeclaration(node) || ts.isAccessor(node)){
            //if(ts.isMethodDeclaration(node) && ts.isIdentifier(node.name) && node.name.text === 'constructor'){
            //    node.parameters.slice(0, node.parameters.length-1)
            //        .filter(v=>
            //            ts.isIdentifier(v.name) && v.modifiers?.find(v=>v.kind===ts.SyntaxKind.PublicKeyword)
            //        ).forEach(v => classPropertiesAndMethods.set((v.name as ts.Identifier).text, true))
            //}

            const vars = getVariablesInScope(node)
            
            const vars_pushed = vars.length
            scope.push(...vars)

            const ret = ts.visitEachChild(node, visitor, undefined);

            if(vars_pushed != 0)
                scope.splice(scope.length-vars_pushed, vars_pushed)
            if(copy_this && ret.body){
                return ts.factory.createMethodDeclaration(
                    ret.modifiers, ret.asteriskToken, ret.name, ret.questionToken, ret.typeParameters,
                    ret.parameters.map(p =>
                        p.initializer
                         ? visitor(p.initializer) as ts.ParameterDeclaration
                         : p
                    ),
                    ret.type,
                    ts.factory.createBlock([
                        ts.factory.createVariableStatement(
                            undefined,
                            ts.factory.createVariableDeclarationList(
                              [ts.factory.createVariableDeclaration(
                                ts.factory.createIdentifier("this_"),
                                undefined,
                                undefined,
                                ts.factory.createThis()
                              )],
                              ts.NodeFlags.Const
                            )
                        ),
                        ...ret.body.statements
                    ])
                )
            }
            return ret;
        }else if(ts.isFunctionDeclaration(node)){
            copy_this = true;
            const prev_in_fun_decl = in_fun_decl;
            in_fun_decl = true;
            const ret = ts.visitEachChild(node, visitor, undefined);
            in_fun_decl = prev_in_fun_decl
            return ret;
        }else{
            return ts.visitEachChild(node, visitor, undefined);
        }
        
    };

    // Check if identifier is shadowed by a local variable
    function isShadowed(identifier: ts.Identifier, scope: string[]): boolean {
        for (let i = scope.length; i > 0; --i) {
            if(scope[i] === identifier.text){
                console.log('is shadowed', identifier.text, scope.length)
                return true;
            }
        }
        return false;
    }
    return visitor(node);
}

// Run the transformer
function transform(source: string, path:string): string {
    const sourceFile = ts.createSourceFile(path, source, ts.ScriptTarget.ESNext, true);
    sourceFile.text = source;

    const result = ts.transform(sourceFile, [
        factoryToClassTransformer,
        addThisTransformer,
    ]);

    const printer = ts.createPrinter({ newLine: ts.NewLineKind.LineFeed });
    const transformedSourceFile = result.transformed[0] as ts.SourceFile;
    transformedSourceFile.text = source;

    console.log("Printing "+path)
    return printer.printFile(transformedSourceFile);
}

export type Patch = {
    body?: string | ((s: string) => string),
    args?: string | ((s: string) => string),
    addPreFunc?: string
}

export const function_re = /\n((?:export )?)([ \t]*)function ([^\(]+)\(([^\)]*)\)[^\{;]*([\{;])/g
export function applyPatches(code: string, patches: Record<string, (Patch|undefined)[]>){
    const occ_count: Record<string, number> = {}
    const buf: string[] = []
    enum rei {
        total = 0,
        export,
        space,
        func,
        args,
        semicol
    }

    let m: RegExpExecArray|null, lastidx = 0;
    while(m = function_re.exec(code)){
        //console.log('func:', m[rei.func])
        let ps = patches[m[rei.func]]
        if(ps){
            let occ = occ_count[m[rei.func]]
            let p: Patch|undefined;
            if(p = ps[occ ?? 0]){
                const body_start = m.index + m[rei.total].length
                const body_end = m[rei.semicol]==='{' ? code.indexOf('\n'+m[rei.space]+'}', body_start) : body_start
                const args_start = m.index + m[rei.export].length + m[rei.space].length +
                    m[rei.func].length + '\nfunction ('.length
                const args_end = args_start + m[rei.args].length

                if(p.addPreFunc){
                    const prefunc_idx = m.index + m[rei.export].length + m[rei.space].length + 1
                    buf.push(
                        code.substring(lastidx, prefunc_idx),
                        p.addPreFunc+' ')
                    lastidx = prefunc_idx
                }

                if(p.args){
                    buf.push(
                        code.substring(lastidx, args_start),
                        typeof p.args === 'string'
                         ? p.args
                         : p.args(code.substring(args_start, args_end)))
                    lastidx = args_end
                }
                //else
                //    buf.push(code.substring(lastidx, body_start))

                if(p.body){
                    buf.push(
                        code.substring(lastidx, body_start),
                        typeof p.body === 'string'
                         ? p.body
                         : p.body(code.substring(body_start, body_end))
                    )
                    lastidx = body_end
                }
            }
            occ_count[m[rei.func]] = occ ? occ+1 : 1
        }
    }

    buf.push(code.substring(lastidx))
    return buf.join('')
}

function patchFile(code: string, origpath: string, dstpath: string, patches?: Record<string, (Patch | undefined)[]>, pre_code_mod?: (code: string, path: string)=>string, post_code_mod?: (code: string, path: string)=>string){

    pre_code_mod  && (code = pre_code_mod(code, origpath))
    patches       && (code = applyPatches(code, patches))
    post_code_mod && (code = post_code_mod(code, origpath))

    writeFileSync(dstpath, code)
}

async function main(){
    const path = join(dirname(dirname(__dirname)), 'out_languages', 'common', 'ts_printer.ts')
    const path_orig = path + '.orig'
    let content;

    if(!existsSync(path_orig)){
        let resp = await fetch('https://raw.githubusercontent.com/microsoft/TypeScript/refs/tags/v5.9.3/src/compiler/emitter.ts')
        content = await resp.text()
        await fsp.writeFile(path_orig, content)
    }else{
        content = await fsp.readFile(path_orig, 'utf-8')
    }

    //const systemfuncs = ["args", "newLine", "useCaseSensitiveFileNames", "write", "writeOutputIsTTY", "getWidthOfTerminal", "readFile", "getFileSize",
    //    "writeFile", "watchFile", "watchDirectory", "resolvePath", "fileExists", "directoryExists", "createDirectory", "getExecutingFilePath", "getCurrentDirectory",
    //    "getDirectories", "readDirectory", "getModifiedTime", "setModifiedTime", "deleteFile", "createHash", "createSHA256Hash", "getMemoryUsage", "exit", "realpath",
    //    "setTimeout", "clearTimeout", "clearScreen", "base64decode", "base64encode"];

    //const withDefaults = [{ body: (body:string)=>body.replace('createPrinter(', 'createPrinter({}, ') }];

    // Patch emitter.ts
    patchFile(content, path_orig, path, {
      createPrinter: [{ args: args => 'extra: EmitterExtraContext, ' + args }],
      //createPrinterWithDefaults: withDefaults,
      //createPrinterWithRemoveComments: withDefaults,
      //createPrinterWithRemoveCommentsNeverAsciiEscape: withDefaults,
      //createPrinterWithRemoveCommentsOmitTrailingSemicolon: withDefaults,
      emitFiles: [{
          args: args => args + ', createPrinterFunc = createPrinter, typeChecker?: ts.TypeChecker'
      }],
      getOutputExtension: [{
          //args: args => args.replace(/options:[^\)]+/, 'options: CompilerOptions'),
          //body: body => body.replace('Extension.Js;', '((options.outputExtension ?? Extension.Js) as Extension)')
          body: '\n    return typoly_getOutputExtension(fileName, options);'
      }],
      //getOutputPathsForBundle: [{
      //    body: body => body.replaceAll('Extension.Dts', '(options.declarationOutputExtension ?? Extension.Dts)')
      //}],
      //getOutputDeclarationFileNameWorker: [{
      //    body: body => body.replace(/getDeclarationEmitExtensionForPath\([^\)]+\)/, v=>`dealDeclarationExt(options, ${v})`)
      //}],
      getDeclarationEmitOutputFilePath: [{
          body: body => body.replaceAll('getDeclarationEmitOutputFilePath', 'typoly_getDeclarationEmitOutputFilePath')
      }],
      emitJsFileOrBundle: [{
          body: body => body
            //.replace(/(const printerOptions: PrinterOptions = \{)(\r?\n)/,
            //    '$1$2\t\t\tcompilerOptions, resolver, host,$2')
            .replace('createPrinter(', 'createPrinterFunc({typeChecker, compilerOptions, resolver, host}, ')
            //.replace('|| emitOnly ||', '||')
            .replace(/(const transform = transformNodes\([^\)]+\);)/,
                "$1\n\t\ttransform.transformed.forEach(t => t.kind === SyntaxKind.SourceFile ? t.text ??= (t.original! as SourceFile).text : 0)")
      }],
      emitDeclarationFileOrBundle: [{
          body: body => body
            //.replace(/(const printerOptions: PrinterOptions = \{)(\r?\n)/,
            //    '$1$2\t\t\t\tcompilerOptions, resolver, host,$2')
            //.replace('createPrinter(', 'createPrinterFunc(typeChecker, ')
            .replace('createPrinter(', 'createPrinterFunc({typeChecker, compilerOptions, resolver, host}, ')
            .replace(/(const declarationTransform = transformNodes\([^\)]+\);)/,
                "$1\n\t\tdeclarationTransform.transformed.forEach(t => t.kind === SyntaxKind.SourceFile ? t.text ??= (t.original! as SourceFile).text : 0)")
      }],
    //})
    }, transform, (code, f) => {
        code = code.replace('import * as ts from "./_namespaces/ts.js";',
            'import * as ts from "typescript";\n'+
            'import { type EmitterExtraContext, typoly_getDeclarationEmitOutputFilePath, typoly_getOutputExtension } from "./emitter_extra"')
        //code = code.replace('from "./_namespaces/ts.js";', 'from "typescript";')
        //code = code.replace(/import \{([^\}]+)\} from "\.\/_namespaces\/ts\.js"/, (v0, v1: string) => {
        //    let imports = v1.split(',').map(v=>v.trim())
        //    let systemimports = imports.filter(v => systemfuncs.includes(v)).join(', ')
        //    let notsystemimports = imports.filter(v => !systemfuncs.includes(v)).join(', ')
        //    return 'import type {'+notsystemimports+'} from "typescript"'
        //        +'\nimport {'+systemimports+'} from "../core/system"'
        //})

        code = code.replace(/import \{([^\}]+)\} from "\.\/_namespaces\/ts\.js"/, (v0, v1: string) => {
            return '//@ts-ignore\nimport {'+v1.split(',').map(v => v.trim()).join(',')+'} from "typescript"'
        })
        code = code.replace('import * as performance from "./_namespaces/ts.performance.js";', 'const performance = (ts as any).performance;')
        code = code.replaceAll(/^export const createPrinterWith.+createPrinter\(/gm, v => v+'{}, ')
        return code
    })
}
main()
