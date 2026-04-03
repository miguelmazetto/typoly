import * as ts from "typescript";
import { type EmitterExtraContext, typoly_getDeclarationEmitOutputFilePath, typoly_getOutputExtension } from "../core/emitter_extra"
//@ts-ignore
import {AccessorDeclaration,ArrayBindingPattern,ArrayLiteralExpression,ArrayTypeNode,ArrowFunction,AsExpression,AwaitExpression,base64encode,BigIntLiteral,BinaryExpression,BinaryOperatorToken,BindingElement,BindingPattern,Block,BlockLike,BreakStatement,BuildInfo,Bundle,CallExpression,CallSignatureDeclaration,canHaveLocals,canIncludeBindAndCheckDiagnostics,CaseBlock,CaseClause,CaseOrDefaultClause,cast,CatchClause,changeExtension,CharacterCodes,ClassDeclaration,ClassExpression,ClassStaticBlockDeclaration,combinePaths,CommaListExpression,CommentRange,compareEmitHelpers,comparePaths,Comparison,CompilerOptions,computeCommonSourceDirectoryOfFilenames,ComputedPropertyName,computeLineStarts,ConditionalExpression,ConditionalTypeNode,ConstructorDeclaration,ConstructorTypeNode,ConstructSignatureDeclaration,contains,ContinueStatement,createBinaryExpressionTrampoline,createDiagnosticCollection,createGetCanonicalFileName,createSourceMapGenerator,createTextWriter,Debug,DebuggerStatement,DeclarationName,Decorator,DefaultClause,DeleteExpression,directorySeparator,DoStatement,DotToken,ElementAccessExpression,emitDetachedComments,EmitFileNames,EmitFlags,EmitHint,EmitHost,emitNewLineBeforeLeadingCommentOfPosition,EmitOnly,EmitResolver,EmitResult,EmitTextWriter,EmitTransformers,emptyArray,ensureTrailingDirectorySeparator,EntityName,EnumDeclaration,EnumMember,escapeJsxAttributeString,escapeLeadingUnderscores,escapeNonAsciiString,escapeString,every,ExportAssignment,ExportDeclaration,ExportSpecifier,Expression,ExpressionStatement,ExpressionWithTypeArguments,Extension,ExternalModuleReference,factory,fileExtensionIs,fileExtensionIsOneOf,FileReference,filter,findIndex,firstOrUndefined,forEach,forEachChild,forEachLeadingCommentRange,forEachTrailingCommentRange,ForInOrOfStatement,ForInStatement,formatGeneratedName,formatGeneratedNamePart,ForOfStatement,ForStatement,FunctionDeclaration,FunctionExpression,FunctionLikeDeclaration,FunctionTypeNode,GeneratedIdentifier,GeneratedIdentifierFlags,GeneratedNamePart,GeneratedPrivateIdentifier,getAreDeclarationMapsEnabled,getBaseFileName,GetCanonicalFileName,getCommentRange,getConstantValue,getContainingNodeArray,getDeclarationEmitExtensionForPath,getDeclarationEmitOutputFilePath,getDirectoryPath,getEmitDeclarations,getEmitFlags,getEmitHelpers,getEmitModuleKind,getEmitModuleResolutionKind,getEmitScriptTarget,getExternalModuleName,getIdentifierTypeArguments,getInternalEmitFlags,getLeadingCommentRanges,getLineAndCharacterOfPosition,getLinesBetweenPositionAndNextNonWhitespaceCharacter,getLinesBetweenPositionAndPrecedingNonWhitespaceCharacter,getLinesBetweenRangeEndAndRangeStart,getLineStarts,getLiteralText,GetLiteralTextFlags,getNewLineCharacter,getNodeForGeneratedName,getNodeId,getNormalizedAbsolutePath,getOriginalNode,getOwnEmitOutputFilePath,getParseTreeNode,getRelativePathFromDirectory,getRelativePathToDirectoryOrUrl,getRootLength,getShebang,getSnippetElement,getSourceFileOfNode,getSourceFilePathInNewDir,getSourceFilesToEmit,getSourceMapRange,getSourceTextOfNodeFromSourceFile,getStartsOnNewLine,getSyntheticLeadingComments,getSyntheticTrailingComments,getTextOfJSDocComment,getTextOfJsxNamespacedName,getTrailingCommentRanges,getTrailingSemicolonDeferringWriter,getTypeNode,guessIndentation,HasLocals,hasRecordedExternalHelpers,HeritageClause,Identifier,idText,IfStatement,ImportAttribute,ImportAttributes,ImportClause,ImportDeclaration,ImportEqualsDeclaration,ImportOrExportSpecifier,ImportSpecifier,ImportTypeNode,IndexedAccessTypeNode,IndexSignatureDeclaration,InferTypeNode,InterfaceDeclaration,InternalEmitFlags,IntersectionTypeNode,isAccessExpression,isArray,isArrowFunction,isBinaryExpression,isBindingPattern,isBlock,isDeclarationFileName,isDecorator,isEmptyStatement,isExportAssignment,isExportSpecifier,isExpression,isFileLevelUniqueName,isFunctionLike,isGeneratedIdentifier,isGeneratedPrivateIdentifier,isIdentifier,isImportAttributes,isImportEqualsDeclaration,isIncrementalCompilation,isInJsonFile,isJSDocLikeText,isJsonSourceFile,isJsxClosingElement,isJsxNamespacedName,isJsxOpeningElement,isKeyword,isLet,isLiteralExpression,isMemberName,isModifier,isModuleDeclaration,isNodeDescendantOf,isNumericLiteral,isParenthesizedExpression,isPartiallyEmittedExpression,isPinnedComment,isPrivateIdentifier,isPrologueDirective,isRecognizedTripleSlashComment,isSourceFile,isSourceFileNotJson,isStringLiteral,isTemplateLiteralKind,isTokenKind,isTypeParameterDeclaration,isVarAwaitUsing,isVarConst,isVarUsing,JSDoc,JSDocAugmentsTag,JSDocCallbackTag,JSDocComment,JSDocEnumTag,JSDocFunctionType,JSDocImplementsTag,JSDocImportTag,JSDocNameReference,JSDocNonNullableType,JSDocNullableType,JSDocOptionalType,JSDocOverloadTag,JSDocPropertyLikeTag,JSDocReturnTag,JSDocSatisfiesTag,JSDocSeeTag,JSDocSignature,JSDocTag,JSDocTemplateTag,JSDocThisTag,JSDocThrowsTag,JSDocTypedefTag,JSDocTypeExpression,JSDocTypeLiteral,JSDocTypeTag,JSDocVariadicType,JsxAttribute,JsxAttributes,JsxAttributeValue,JsxClosingElement,JsxClosingFragment,JsxElement,JsxEmit,JsxExpression,JsxFragment,JsxNamespacedName,JsxOpeningElement,JsxOpeningFragment,JsxSelfClosingElement,JsxSpreadAttribute,JsxTagNameExpression,JsxText,LabeledStatement,last,lastOrUndefined,LateBoundDeclaration,length,ListFormat,LiteralExpression,LiteralLikeNode,LiteralTypeNode,makeIdentifierFromModuleName,MappedTypeNode,memoize,MetaProperty,MethodDeclaration,MethodSignature,Modifier,ModifierLike,ModuleBlock,ModuleDeclaration,ModuleKind,ModuleReference,moveRangePastModifiers,NamedDeclaration,NamedExports,NamedImports,NamedImportsOrExports,NamedTupleMember,NamespaceExport,NamespaceExportDeclaration,NamespaceImport,NewExpression,Node,NodeArray,NodeFlags,nodeIsSynthesized,noEmitNotification,noEmitSubstitution,NonNullExpression,normalizePath,normalizeSlashes,notImplemented,NumericLiteral,ObjectBindingPattern,ObjectLiteralExpression,OptionalTypeNode,ParameterDeclaration,ParenthesizedExpression,ParenthesizedTypeNode,ParsedCommandLine,PartiallyEmittedExpression,Placeholder,positionIsSynthesized,positionsAreOnSameLine,PostfixUnaryExpression,PrefixUnaryExpression,Printer,PrinterOptions,PrintHandlers,PrivateIdentifier,PropertyAccessExpression,PropertyAssignment,PropertyDeclaration,PropertySignature,QualifiedName,rangeEndIsOnSameLineAsRangeStart,rangeEndPositionsAreOnSameLine,rangeIsOnSingleLine,rangeStartPositionsAreOnSameLine,readJsonOrUndefined,removeFileExtension,resolvePath,RestTypeNode,ReturnStatement,SatisfiesExpression,ScriptTarget,setOriginalNode,setTextRange,setTextRangePosEnd,ShorthandPropertyAssignment,SignatureDeclaration,singleOrUndefined,skipPartiallyEmittedExpressions,skipTrivia,SnippetElement,SnippetKind,some,SourceFile,SourceMapEmitResult,SourceMapGenerator,SourceMapSource,SpreadAssignment,SpreadElement,Statement,StringLiteral,supportedJSExtensionsFlat,SwitchStatement,Symbol,SymbolFlags,SyntaxKind,SynthesizedComment,sys,TabStop,TaggedTemplateExpression,TemplateExpression,TemplateLiteralTypeNode,TemplateLiteralTypeSpan,TemplateSpan,TextRange,ThrowStatement,TokenFlags,tokenToString,toSorted,tracing,TransformationResult,transformNodes,tryCast,TryStatement,TupleTypeNode,TypeAliasDeclaration,TypeAssertion,TypeLiteralNode,TypeNode,TypeOfExpression,TypeOperatorNode,TypeParameterDeclaration,TypePredicateNode,TypeQueryNode,TypeReferenceNode,UnionTypeNode,VariableDeclaration,VariableDeclarationList,VariableStatement,version,VoidExpression,WhileStatement,WithStatement,writeCommentRange,writeFile,WriteFileCallbackData,YieldExpression,} from "typescript";
const performance = (ts as any).performance;
const brackets = createBracketsMap();
/** @internal */
export function isBuildInfoFile(file: string): boolean {
    return fileExtensionIs(file, Extension.TsBuildInfo);
}
/**
 * Iterates over the source files that are expected to have an emit output.
 *
 * @param host An EmitHost.
 * @param action The action to execute.
 * @param sourceFilesOrTargetSourceFile
 *   If an array, the full list of source files to emit.
 *   Else, calls `getSourceFilesToEmit` with the (optional) target source file to determine the list of source files to emit.
 *
 * @internal
 */
export function forEachEmittedFile<T>(host: EmitHost, action: (emitFileNames: EmitFileNames, sourceFileOrBundle: SourceFile | Bundle | undefined) => T, sourceFilesOrTargetSourceFile?: readonly SourceFile[] | SourceFile, forceDtsEmit = false, onlyBuildInfo?: boolean, includeBuildInfo?: boolean): T | undefined {
    const sourceFiles = isArray(sourceFilesOrTargetSourceFile) ? sourceFilesOrTargetSourceFile : getSourceFilesToEmit(host, sourceFilesOrTargetSourceFile, forceDtsEmit);
    const options = host.getCompilerOptions();
    if (!onlyBuildInfo) {
        if (options.outFile) {
            if (sourceFiles.length) {
                const bundle = factory.createBundle(sourceFiles);
                const result = action(getOutputPathsFor(bundle, host, forceDtsEmit), bundle);
                if (result) {
                    return result;
                }
            }
        }
        else {
            for (const sourceFile of sourceFiles) {
                const result = action(getOutputPathsFor(sourceFile, host, forceDtsEmit), sourceFile);
                if (result) {
                    return result;
                }
            }
        }
    }
    if (includeBuildInfo) {
        const buildInfoPath = getTsBuildInfoEmitOutputFilePath(options);
        if (buildInfoPath)
            return action({ buildInfoPath }, /*sourceFileOrBundle*/ undefined);
    }
}
export function getTsBuildInfoEmitOutputFilePath(options: CompilerOptions): string | undefined {
    const configFile = options.configFilePath;
    if (!canEmitTsBuildInfo(options))
        return undefined;
    if (options.tsBuildInfoFile)
        return options.tsBuildInfoFile;
    const outPath = options.outFile;
    let buildInfoExtensionLess: string;
    if (outPath) {
        buildInfoExtensionLess = removeFileExtension(outPath);
    }
    else {
        if (!configFile)
            return undefined;
        const configFileExtensionLess = removeFileExtension(configFile);
        buildInfoExtensionLess = options.outDir ?
            options.rootDir ?
                resolvePath(options.outDir, getRelativePathFromDirectory(options.rootDir, configFileExtensionLess, /*ignoreCase*/ true)) :
                combinePaths(options.outDir, getBaseFileName(configFileExtensionLess)) :
            configFileExtensionLess;
    }
    return buildInfoExtensionLess + Extension.TsBuildInfo;
}
function canEmitTsBuildInfo(options: CompilerOptions) {
    return isIncrementalCompilation(options) || !!options.tscBuild;
}
function getOutputPathsForBundle(options: CompilerOptions, forceDtsPaths: boolean): EmitFileNames {
    const outPath = options.outFile!;
    const jsFilePath = options.emitDeclarationOnly ? undefined : outPath;
    const sourceMapFilePath = jsFilePath && getSourceMapFilePath(jsFilePath, options);
    const declarationFilePath = (forceDtsPaths || getEmitDeclarations(options)) ? removeFileExtension(outPath) + Extension.Dts : undefined;
    const declarationMapPath = declarationFilePath && getAreDeclarationMapsEnabled(options) ? declarationFilePath + ".map" : undefined;
    return { jsFilePath, sourceMapFilePath, declarationFilePath, declarationMapPath };
}
/** @internal */
export function getOutputPathsFor(sourceFile: SourceFile | Bundle, host: EmitHost, forceDtsPaths: boolean): EmitFileNames {
    const options = host.getCompilerOptions();
    if (sourceFile.kind === SyntaxKind.Bundle) {
        return getOutputPathsForBundle(options, forceDtsPaths);
    }
    else {
        const ownOutputFilePath = getOwnEmitOutputFilePath(sourceFile.fileName, host, getOutputExtension(sourceFile.fileName, options));
        const isJsonFile = isJsonSourceFile(sourceFile);
        // If json file emits to the same location skip writing it, if emitDeclarationOnly skip writing it
        const isJsonEmittedToSameLocation = isJsonFile &&
            comparePaths(sourceFile.fileName, ownOutputFilePath, host.getCurrentDirectory(), !host.useCaseSensitiveFileNames()) === Comparison.EqualTo;
        const jsFilePath = options.emitDeclarationOnly || isJsonEmittedToSameLocation ? undefined : ownOutputFilePath;
        const sourceMapFilePath = !jsFilePath || isJsonSourceFile(sourceFile) ? undefined : getSourceMapFilePath(jsFilePath, options);
        const declarationFilePath = (forceDtsPaths || (getEmitDeclarations(options) && !isJsonFile)) ? getDeclarationEmitOutputFilePath(sourceFile.fileName, host) : undefined;
        const declarationMapPath = declarationFilePath && getAreDeclarationMapsEnabled(options) ? declarationFilePath + ".map" : undefined;
        return { jsFilePath, sourceMapFilePath, declarationFilePath, declarationMapPath };
    }
}
function getSourceMapFilePath(jsFilePath: string, options: CompilerOptions) {
    return (options.sourceMap && !options.inlineSourceMap) ? jsFilePath + ".map" : undefined;
}
/** @internal */
export function getOutputExtension(fileName: string, options: Pick<CompilerOptions, "jsx">): Extension {
    return typoly_getOutputExtension(fileName, options);
}
function getOutputPathWithoutChangingExt(inputFileName: string, ignoreCase: boolean, outputDir: string | undefined, getCommonSourceDirectory: () => string): string {
    return outputDir ?
        resolvePath(outputDir, getRelativePathFromDirectory(getCommonSourceDirectory(), inputFileName, ignoreCase)) :
        inputFileName;
}
/** @internal */
export function getOutputDeclarationFileName(inputFileName: string, configFile: ParsedCommandLine, ignoreCase: boolean, getCommonSourceDirectory = (): string => getCommonSourceDirectoryOfConfig(configFile, ignoreCase)): string {
    return getOutputDeclarationFileNameWorker(inputFileName, configFile.options, ignoreCase, getCommonSourceDirectory);
}
/** @internal */
export function getOutputDeclarationFileNameWorker(inputFileName: string, options: CompilerOptions, ignoreCase: boolean, getCommonSourceDirectory: () => string): string {
    return changeExtension(getOutputPathWithoutChangingExt(inputFileName, ignoreCase, options.declarationDir || options.outDir, getCommonSourceDirectory), getDeclarationEmitExtensionForPath(inputFileName));
}
function getOutputJSFileName(inputFileName: string, configFile: ParsedCommandLine, ignoreCase: boolean, getCommonSourceDirectory = () => getCommonSourceDirectoryOfConfig(configFile, ignoreCase)) {
    if (configFile.options.emitDeclarationOnly)
        return undefined;
    const isJsonFile = fileExtensionIs(inputFileName, Extension.Json);
    const outputFileName = getOutputJSFileNameWorker(inputFileName, configFile.options, ignoreCase, getCommonSourceDirectory);
    return !isJsonFile || comparePaths(inputFileName, outputFileName, Debug.checkDefined(configFile.options.configFilePath), ignoreCase) !== Comparison.EqualTo ?
        outputFileName :
        undefined;
}
/** @internal */
export function getOutputJSFileNameWorker(inputFileName: string, options: CompilerOptions, ignoreCase: boolean, getCommonSourceDirectory: () => string): string {
    return changeExtension(getOutputPathWithoutChangingExt(inputFileName, ignoreCase, options.outDir, getCommonSourceDirectory), getOutputExtension(inputFileName, options));
}
function createAddOutput() {
    let outputs: string[] | undefined;
    return { addOutput, getOutputs };
    function addOutput(path: string | undefined) {
        if (path) {
            (outputs || (outputs = [])).push(path);
        }
    }
    function getOutputs(): readonly string[] {
        return outputs || emptyArray;
    }
}
function getSingleOutputFileNames(configFile: ParsedCommandLine, addOutput: ReturnType<typeof createAddOutput>["addOutput"]) {
    const { jsFilePath, sourceMapFilePath, declarationFilePath, declarationMapPath } = getOutputPathsForBundle(configFile.options, /*forceDtsPaths*/ false);
    addOutput(jsFilePath);
    addOutput(sourceMapFilePath);
    addOutput(declarationFilePath);
    addOutput(declarationMapPath);
}
function getOwnOutputFileNames(configFile: ParsedCommandLine, inputFileName: string, ignoreCase: boolean, addOutput: ReturnType<typeof createAddOutput>["addOutput"], getCommonSourceDirectory?: () => string) {
    if (isDeclarationFileName(inputFileName))
        return;
    const js = getOutputJSFileName(inputFileName, configFile, ignoreCase, getCommonSourceDirectory);
    addOutput(js);
    if (fileExtensionIs(inputFileName, Extension.Json))
        return;
    if (js && configFile.options.sourceMap) {
        addOutput(`${js}.map`);
    }
    if (getEmitDeclarations(configFile.options)) {
        const dts = getOutputDeclarationFileName(inputFileName, configFile, ignoreCase, getCommonSourceDirectory);
        addOutput(dts);
        if (configFile.options.declarationMap) {
            addOutput(`${dts}.map`);
        }
    }
}
/** @internal */
export function getCommonSourceDirectory(options: CompilerOptions, emittedFiles: () => readonly string[], currentDirectory: string, getCanonicalFileName: GetCanonicalFileName, checkSourceFilesBelongToPath?: (commonSourceDirectory: string) => void): string {
    let commonSourceDirectory;
    if (options.rootDir) {
        // If a rootDir is specified use it as the commonSourceDirectory
        commonSourceDirectory = getNormalizedAbsolutePath(options.rootDir, currentDirectory);
        checkSourceFilesBelongToPath?.(options.rootDir);
    }
    else if (options.composite && options.configFilePath) {
        // Project compilations never infer their root from the input source paths
        commonSourceDirectory = getDirectoryPath(normalizeSlashes(options.configFilePath));
        checkSourceFilesBelongToPath?.(commonSourceDirectory);
    }
    else {
        commonSourceDirectory = computeCommonSourceDirectoryOfFilenames(emittedFiles(), currentDirectory, getCanonicalFileName);
    }
    if (commonSourceDirectory && commonSourceDirectory[commonSourceDirectory.length - 1] !== directorySeparator) {
        // Make sure directory path ends with directory separator so this string can directly
        // used to replace with "" to get the relative path of the source file and the relative path doesn't
        // start with / making it rooted path
        commonSourceDirectory += directorySeparator;
    }
    return commonSourceDirectory;
}
/** @internal */
export function getCommonSourceDirectoryOfConfig({ options, fileNames }: ParsedCommandLine, ignoreCase: boolean): string {
    return getCommonSourceDirectory(options, () => filter(fileNames, file => !(options.noEmitForJsFiles && fileExtensionIsOneOf(file, supportedJSExtensionsFlat)) && !isDeclarationFileName(file)), getDirectoryPath(normalizeSlashes(Debug.checkDefined(options.configFilePath))), createGetCanonicalFileName(!ignoreCase));
}
/** @internal */
export function getAllProjectOutputs(configFile: ParsedCommandLine, ignoreCase: boolean): readonly string[] {
    const { addOutput, getOutputs } = createAddOutput();
    if (configFile.options.outFile) {
        getSingleOutputFileNames(configFile, addOutput);
    }
    else {
        const getCommonSourceDirectory = memoize(() => getCommonSourceDirectoryOfConfig(configFile, ignoreCase));
        for (const inputFileName of configFile.fileNames) {
            getOwnOutputFileNames(configFile, inputFileName, ignoreCase, addOutput, getCommonSourceDirectory);
        }
    }
    addOutput(getTsBuildInfoEmitOutputFilePath(configFile.options));
    return getOutputs();
}
export function getOutputFileNames(commandLine: ParsedCommandLine, inputFileName: string, ignoreCase: boolean): readonly string[] {
    inputFileName = normalizePath(inputFileName);
    Debug.assert(contains(commandLine.fileNames, inputFileName), `Expected fileName to be present in command line`);
    const { addOutput, getOutputs } = createAddOutput();
    if (commandLine.options.outFile) {
        getSingleOutputFileNames(commandLine, addOutput);
    }
    else {
        getOwnOutputFileNames(commandLine, inputFileName, ignoreCase, addOutput);
    }
    return getOutputs();
}
/** @internal */
export function getFirstProjectOutput(configFile: ParsedCommandLine, ignoreCase: boolean): string {
    if (configFile.options.outFile) {
        const { jsFilePath, declarationFilePath } = getOutputPathsForBundle(configFile.options, /*forceDtsPaths*/ false);
        return Debug.checkDefined(jsFilePath || declarationFilePath, `project ${configFile.options.configFilePath} expected to have at least one output`);
    }
    const getCommonSourceDirectory = memoize(() => getCommonSourceDirectoryOfConfig(configFile, ignoreCase));
    for (const inputFileName of configFile.fileNames) {
        if (isDeclarationFileName(inputFileName))
            continue;
        const jsFilePath = getOutputJSFileName(inputFileName, configFile, ignoreCase, getCommonSourceDirectory);
        if (jsFilePath)
            return jsFilePath;
        if (fileExtensionIs(inputFileName, Extension.Json))
            continue;
        if (getEmitDeclarations(configFile.options)) {
            return getOutputDeclarationFileName(inputFileName, configFile, ignoreCase, getCommonSourceDirectory);
        }
    }
    const buildInfoPath = getTsBuildInfoEmitOutputFilePath(configFile.options);
    if (buildInfoPath)
        return buildInfoPath;
    return Debug.fail(`project ${configFile.options.configFilePath} expected to have at least one output`);
}
/** @internal */
export function emitResolverSkipsTypeChecking(emitOnly: boolean | EmitOnly | undefined, forceDtsEmit: boolean | undefined): boolean {
    return !!forceDtsEmit && !!emitOnly;
}
/** @internal */
// targetSourceFile is when users only want one file in entire project to be emitted. This is used in compileOnSave feature
export function emitFiles(resolver: EmitResolver, host: EmitHost, targetSourceFile: SourceFile | undefined, { scriptTransformers, declarationTransformers }: EmitTransformers, emitOnly: boolean | EmitOnly | undefined, onlyBuildInfo: boolean, forceDtsEmit?: boolean, skipBuildInfo?: boolean, createPrinterFunc = createPrinter, typeChecker?: ts.TypeChecker): EmitResult {
    // Why var? It avoids TDZ checks in the runtime which can be costly.
    // See: https://github.com/microsoft/TypeScript/issues/52924
    /* eslint-disable no-var */
    var compilerOptions = host.getCompilerOptions();
    var sourceMapDataList: SourceMapEmitResult[] | undefined = (compilerOptions.sourceMap || compilerOptions.inlineSourceMap || getAreDeclarationMapsEnabled(compilerOptions)) ? [] : undefined;
    var emittedFilesList: string[] | undefined = compilerOptions.listEmittedFiles ? [] : undefined;
    var emitterDiagnostics = createDiagnosticCollection();
    var newLine = getNewLineCharacter(compilerOptions);
    var writer = createTextWriter(newLine);
    var { enter, exit } = performance.createTimer("printTime", "beforePrint", "afterPrint");
    var emitSkipped = false;
    /* eslint-enable no-var */
    // Emit each output file
    enter();
    forEachEmittedFile(host, emitSourceFileOrBundle, getSourceFilesToEmit(host, targetSourceFile, forceDtsEmit), forceDtsEmit, onlyBuildInfo, !targetSourceFile && !skipBuildInfo);
    exit();
    return {
        emitSkipped,
        diagnostics: emitterDiagnostics.getDiagnostics(),
        emittedFiles: emittedFilesList,
        sourceMaps: sourceMapDataList,
    };
    function emitSourceFileOrBundle({ jsFilePath, sourceMapFilePath, declarationFilePath, declarationMapPath, buildInfoPath }: EmitFileNames, sourceFileOrBundle: SourceFile | Bundle | undefined) {
        tracing?.push(tracing.Phase.Emit, "emitJsFileOrBundle", { jsFilePath });
        emitJsFileOrBundle(sourceFileOrBundle, jsFilePath, sourceMapFilePath);
        tracing?.pop();
        tracing?.push(tracing.Phase.Emit, "emitDeclarationFileOrBundle", { declarationFilePath });
        emitDeclarationFileOrBundle(sourceFileOrBundle, declarationFilePath, declarationMapPath);
        tracing?.pop();
        tracing?.push(tracing.Phase.Emit, "emitBuildInfo", { buildInfoPath });
        emitBuildInfo(buildInfoPath);
        tracing?.pop();
    }
    function emitBuildInfo(buildInfoPath: string | undefined) {
        // Write build information if applicable
        if (!buildInfoPath || targetSourceFile)
            return;
        if (host.isEmitBlocked(buildInfoPath)) {
            emitSkipped = true;
            return;
        }
        const buildInfo = host.getBuildInfo() || { version };
        // Pass buildinfo as additional data to avoid having to reparse
        writeFile(host, emitterDiagnostics, buildInfoPath, getBuildInfoText(buildInfo), /*writeByteOrderMark*/ false, /*sourceFiles*/ undefined, { buildInfo });
        emittedFilesList?.push(buildInfoPath);
    }
    function emitJsFileOrBundle(sourceFileOrBundle: SourceFile | Bundle | undefined, jsFilePath: string | undefined, sourceMapFilePath: string | undefined) {
        if (!sourceFileOrBundle || emitOnly || !jsFilePath) {
            return;
        }
        // Make sure not to write js file and source map file if any of them cannot be written
        if (host.isEmitBlocked(jsFilePath) || compilerOptions.noEmit) {
            emitSkipped = true;
            return;
        }
        (isSourceFile(sourceFileOrBundle) ? [sourceFileOrBundle] : filter(sourceFileOrBundle.sourceFiles, isSourceFileNotJson)).forEach(sourceFile => {
            if (compilerOptions.noCheck ||
                !canIncludeBindAndCheckDiagnostics(sourceFile, compilerOptions))
                markLinkedReferences(sourceFile);
        });
        // Transform the source files
        const transform = transformNodes(resolver, host, factory, compilerOptions, [sourceFileOrBundle], scriptTransformers, /*allowDtsFiles*/ false);
		transform.transformed.forEach(t => t.kind === SyntaxKind.SourceFile ? t.text ??= (t.original! as SourceFile).text : 0)
        const printerOptions: PrinterOptions = {
            removeComments: compilerOptions.removeComments,
            newLine: compilerOptions.newLine,
            noEmitHelpers: compilerOptions.noEmitHelpers,
            module: getEmitModuleKind(compilerOptions),
            moduleResolution: getEmitModuleResolutionKind(compilerOptions),
            target: getEmitScriptTarget(compilerOptions),
            sourceMap: compilerOptions.sourceMap,
            inlineSourceMap: compilerOptions.inlineSourceMap,
            inlineSources: compilerOptions.inlineSources,
            extendedDiagnostics: compilerOptions.extendedDiagnostics,
        };
        // Create a printer to print the nodes
        const printer = createPrinterFunc({typeChecker, compilerOptions, resolver, host}, printerOptions, {
            // resolver hooks
            hasGlobalName: resolver.hasGlobalName,
            // transform hooks
            onEmitNode: transform.emitNodeWithNotification,
            isEmitNotificationEnabled: transform.isEmitNotificationEnabled,
            substituteNode: transform.substituteNode,
        });
        Debug.assert(transform.transformed.length === 1, "Should only see one output from the transform");
        printSourceFileOrBundle(jsFilePath, sourceMapFilePath, transform, printer, compilerOptions);
        // Clean up emit nodes on parse tree
        transform.dispose();
        if (emittedFilesList) {
            emittedFilesList.push(jsFilePath);
            if (sourceMapFilePath) {
                emittedFilesList.push(sourceMapFilePath);
            }
        }
    }
    function emitDeclarationFileOrBundle(sourceFileOrBundle: SourceFile | Bundle | undefined, declarationFilePath: string | undefined, declarationMapPath: string | undefined) {
        if (!sourceFileOrBundle || emitOnly === EmitOnly.Js)
            return;
        if (!declarationFilePath) {
            if (emitOnly || compilerOptions.emitDeclarationOnly)
                emitSkipped = true;
            return;
        }
        const sourceFiles = isSourceFile(sourceFileOrBundle) ? [sourceFileOrBundle] : sourceFileOrBundle.sourceFiles;
        const filesForEmit = forceDtsEmit ? sourceFiles : filter(sourceFiles, isSourceFileNotJson);
        // Setup and perform the transformation to retrieve declarations from the input files
        const inputListOrBundle = compilerOptions.outFile ? [factory.createBundle(filesForEmit)] : filesForEmit;
        // Checker wont collect the linked aliases since thats only done when declaration is enabled and checking is performed.
        // Do that here when emitting only dts files
        filesForEmit.forEach(sourceFile => {
            if ((emitOnly && !getEmitDeclarations(compilerOptions)) ||
                compilerOptions.noCheck ||
                emitResolverSkipsTypeChecking(emitOnly, forceDtsEmit) ||
                !canIncludeBindAndCheckDiagnostics(sourceFile, compilerOptions)) {
                collectLinkedAliases(sourceFile);
            }
        });
        const declarationTransform = transformNodes(resolver, host, factory, compilerOptions, inputListOrBundle, declarationTransformers, /*allowDtsFiles*/ false);
		declarationTransform.transformed.forEach(t => t.kind === SyntaxKind.SourceFile ? t.text ??= (t.original! as SourceFile).text : 0)
        if (length(declarationTransform.diagnostics)) {
            for (const diagnostic of declarationTransform.diagnostics!) {
                emitterDiagnostics.add(diagnostic);
            }
        }
        const declBlocked = (!!declarationTransform.diagnostics && !!declarationTransform.diagnostics.length) || !!host.isEmitBlocked(declarationFilePath) || !!compilerOptions.noEmit;
        emitSkipped = emitSkipped || declBlocked;
        if (!declBlocked || forceDtsEmit) {
            Debug.assert(declarationTransform.transformed.length === 1, "Should only see one output from the decl transform");
            const printerOptions: PrinterOptions = {
                removeComments: compilerOptions.removeComments,
                newLine: compilerOptions.newLine,
                noEmitHelpers: true,
                module: compilerOptions.module,
                moduleResolution: compilerOptions.moduleResolution,
                target: compilerOptions.target,
                sourceMap: emitOnly !== EmitOnly.BuilderSignature && compilerOptions.declarationMap,
                inlineSourceMap: compilerOptions.inlineSourceMap,
                extendedDiagnostics: compilerOptions.extendedDiagnostics,
                onlyPrintJsDocStyle: true,
                omitBraceSourceMapPositions: true,
            };
            const declarationPrinter = createPrinterFunc({typeChecker, compilerOptions, resolver, host}, printerOptions, {
                // resolver hooks
                hasGlobalName: resolver.hasGlobalName,
                // transform hooks
                onEmitNode: declarationTransform.emitNodeWithNotification,
                isEmitNotificationEnabled: declarationTransform.isEmitNotificationEnabled,
                substituteNode: declarationTransform.substituteNode,
            });
            const dtsWritten = printSourceFileOrBundle(declarationFilePath, declarationMapPath, declarationTransform, declarationPrinter, {
                sourceMap: printerOptions.sourceMap,
                sourceRoot: compilerOptions.sourceRoot,
                mapRoot: compilerOptions.mapRoot,
                extendedDiagnostics: compilerOptions.extendedDiagnostics,
                // Explicitly do not passthru either `inline` option
            });
            if (emittedFilesList) {
                if (dtsWritten)
                    emittedFilesList.push(declarationFilePath);
                if (declarationMapPath) {
                    emittedFilesList.push(declarationMapPath);
                }
            }
        }
        declarationTransform.dispose();
    }
    function collectLinkedAliases(node: Node) {
        if (isExportAssignment(node)) {
            if (node.expression.kind === SyntaxKind.Identifier) {
                resolver.collectLinkedAliases(node.expression as Identifier, /*setVisibility*/ true);
            }
            return;
        }
        else if (isExportSpecifier(node)) {
            resolver.collectLinkedAliases(node.propertyName || node.name, /*setVisibility*/ true);
            return;
        }
        forEachChild(node, collectLinkedAliases);
    }
    function markLinkedReferences(file: SourceFile) {
        if (ts.isSourceFileJS(file))
            return; // JS files don't use reference calculations as they don't do import ellision, no need to calculate it
        ts.forEachChildRecursively(file, n => {
            if (isImportEqualsDeclaration(n) && !(ts.getSyntacticModifierFlags(n) & ts.ModifierFlags.Export))
                return "skip"; // These are deferred and marked in a chain when referenced
            if (ts.isImportDeclaration(n))
                return "skip"; // likewise, these are ultimately what get marked by calls on other nodes - we want to skip them
            resolver.markLinkedReferences(n);
        });
    }
    function printSourceFileOrBundle(jsFilePath: string, sourceMapFilePath: string | undefined, transform: TransformationResult<SourceFile | Bundle>, printer: Printer, mapOptions: SourceMapOptions) {
        const sourceFileOrBundle = transform.transformed[0];
        const bundle = sourceFileOrBundle.kind === SyntaxKind.Bundle ? sourceFileOrBundle : undefined;
        const sourceFile = sourceFileOrBundle.kind === SyntaxKind.SourceFile ? sourceFileOrBundle : undefined;
        const sourceFiles = bundle ? bundle.sourceFiles : [sourceFile!];
        let sourceMapGenerator: SourceMapGenerator | undefined;
        if (shouldEmitSourceMaps(mapOptions, sourceFileOrBundle)) {
            sourceMapGenerator = createSourceMapGenerator(host, getBaseFileName(normalizeSlashes(jsFilePath)), getSourceRoot(mapOptions), getSourceMapDirectory(mapOptions, jsFilePath, sourceFile), mapOptions);
        }
        if (bundle) {
            printer.writeBundle(bundle, writer, sourceMapGenerator);
        }
        else {
            printer.writeFile(sourceFile!, writer, sourceMapGenerator);
        }
        let sourceMapUrlPos;
        if (sourceMapGenerator) {
            if (sourceMapDataList) {
                sourceMapDataList.push({
                    inputSourceFileNames: sourceMapGenerator.getSources(),
                    sourceMap: sourceMapGenerator.toJSON(),
                });
            }
            const sourceMappingURL = getSourceMappingURL(mapOptions, sourceMapGenerator, jsFilePath, sourceMapFilePath, sourceFile);
            if (sourceMappingURL) {
                if (!writer.isAtStartOfLine())
                    writer.rawWrite(newLine);
                sourceMapUrlPos = writer.getTextPos();
                writer.writeComment(`//# ${"sourceMappingURL"}=${sourceMappingURL}`); // Tools can sometimes see this line as a source mapping url comment
            }
            // Write the source map
            if (sourceMapFilePath) {
                const sourceMap = sourceMapGenerator.toString();
                writeFile(host, emitterDiagnostics, sourceMapFilePath, sourceMap, /*writeByteOrderMark*/ false, sourceFiles);
            }
        }
        else {
            writer.writeLine();
        }
        // Write the output file
        const text = writer.getText();
        const data: WriteFileCallbackData = { sourceMapUrlPos, diagnostics: transform.diagnostics };
        writeFile(host, emitterDiagnostics, jsFilePath, text, !!compilerOptions.emitBOM, sourceFiles, data);
        // Reset state
        writer.clear();
        return !data.skippedDtsWrite;
    }
    interface SourceMapOptions {
        sourceMap?: boolean;
        inlineSourceMap?: boolean;
        inlineSources?: boolean;
        sourceRoot?: string;
        mapRoot?: string;
        extendedDiagnostics?: boolean;
    }
    function shouldEmitSourceMaps(mapOptions: SourceMapOptions, sourceFileOrBundle: SourceFile | Bundle) {
        return (mapOptions.sourceMap || mapOptions.inlineSourceMap)
            && (sourceFileOrBundle.kind !== SyntaxKind.SourceFile || !fileExtensionIs(sourceFileOrBundle.fileName, Extension.Json));
    }
    function getSourceRoot(mapOptions: SourceMapOptions) {
        // Normalize source root and make sure it has trailing "/" so that it can be used to combine paths with the
        // relative paths of the sources list in the sourcemap
        const sourceRoot = normalizeSlashes(mapOptions.sourceRoot || "");
        return sourceRoot ? ensureTrailingDirectorySeparator(sourceRoot) : sourceRoot;
    }
    function getSourceMapDirectory(mapOptions: SourceMapOptions, filePath: string, sourceFile: SourceFile | undefined) {
        if (mapOptions.sourceRoot)
            return host.getCommonSourceDirectory();
        if (mapOptions.mapRoot) {
            let sourceMapDir = normalizeSlashes(mapOptions.mapRoot);
            if (sourceFile) {
                // For modules or multiple emit files the mapRoot will have directory structure like the sources
                // So if src\a.ts and src\lib\b.ts are compiled together user would be moving the maps into mapRoot\a.js.map and mapRoot\lib\b.js.map
                sourceMapDir = getDirectoryPath(getSourceFilePathInNewDir(sourceFile.fileName, host, sourceMapDir));
            }
            if (getRootLength(sourceMapDir) === 0) {
                // The relative paths are relative to the common directory
                sourceMapDir = combinePaths(host.getCommonSourceDirectory(), sourceMapDir);
            }
            return sourceMapDir;
        }
        return getDirectoryPath(normalizePath(filePath));
    }
    function getSourceMappingURL(mapOptions: SourceMapOptions, sourceMapGenerator: SourceMapGenerator, filePath: string, sourceMapFilePath: string | undefined, sourceFile: SourceFile | undefined) {
        if (mapOptions.inlineSourceMap) {
            // Encode the sourceMap into the sourceMap url
            const sourceMapText = sourceMapGenerator.toString();
            const base64SourceMapText = base64encode(sys, sourceMapText);
            return `data:application/json;base64,${base64SourceMapText}`;
        }
        const sourceMapFile = getBaseFileName(normalizeSlashes(Debug.checkDefined(sourceMapFilePath)));
        if (mapOptions.mapRoot) {
            let sourceMapDir = normalizeSlashes(mapOptions.mapRoot);
            if (sourceFile) {
                // For modules or multiple emit files the mapRoot will have directory structure like the sources
                // So if src\a.ts and src\lib\b.ts are compiled together user would be moving the maps into mapRoot\a.js.map and mapRoot\lib\b.js.map
                sourceMapDir = getDirectoryPath(getSourceFilePathInNewDir(sourceFile.fileName, host, sourceMapDir));
            }
            if (getRootLength(sourceMapDir) === 0) {
                // The relative paths are relative to the common directory
                sourceMapDir = combinePaths(host.getCommonSourceDirectory(), sourceMapDir);
                return encodeURI(getRelativePathToDirectoryOrUrl(getDirectoryPath(normalizePath(filePath)), // get the relative sourceMapDir path based on jsFilePath
                combinePaths(sourceMapDir, sourceMapFile), // this is where user expects to see sourceMap
                host.getCurrentDirectory(), host.getCanonicalFileName, 
                /*isAbsolutePathAnUrl*/ true));
            }
            else {
                return encodeURI(combinePaths(sourceMapDir, sourceMapFile));
            }
        }
        return encodeURI(sourceMapFile);
    }
}
/** @internal */
export function getBuildInfoText(buildInfo: BuildInfo): string {
    return JSON.stringify(buildInfo);
}
/** @internal */
export function getBuildInfo(buildInfoFile: string, buildInfoText: string) {
    return readJsonOrUndefined(buildInfoFile, buildInfoText) as BuildInfo | undefined;
}
/** @internal */
export const notImplementedResolver: EmitResolver = {
    hasGlobalName: notImplemented,
    getReferencedExportContainer: notImplemented,
    getReferencedImportDeclaration: notImplemented,
    getReferencedDeclarationWithCollidingName: notImplemented,
    isDeclarationWithCollidingName: notImplemented,
    isValueAliasDeclaration: notImplemented,
    isReferencedAliasDeclaration: notImplemented,
    isTopLevelValueImportEqualsWithEntityName: notImplemented,
    hasNodeCheckFlag: notImplemented,
    isDeclarationVisible: notImplemented,
    isLateBound: (_node): _node is LateBoundDeclaration => false,
    collectLinkedAliases: notImplemented,
    markLinkedReferences: notImplemented,
    isImplementationOfOverload: notImplemented,
    requiresAddingImplicitUndefined: notImplemented,
    isExpandoFunctionDeclaration: notImplemented,
    getPropertiesOfContainerFunction: notImplemented,
    createTypeOfDeclaration: notImplemented,
    createReturnTypeOfSignatureDeclaration: notImplemented,
    createTypeOfExpression: notImplemented,
    createLiteralConstValue: notImplemented,
    isSymbolAccessible: notImplemented,
    isEntityNameVisible: notImplemented,
    // Returns the constant value this property access resolves to: notImplemented, or 'undefined' for a non-constant
    getConstantValue: notImplemented,
    getEnumMemberValue: notImplemented,
    getReferencedValueDeclaration: notImplemented,
    getReferencedValueDeclarations: notImplemented,
    getTypeReferenceSerializationKind: notImplemented,
    isOptionalParameter: notImplemented,
    isArgumentsLocalBinding: notImplemented,
    getExternalModuleFileFromDeclaration: notImplemented,
    isLiteralConstDeclaration: notImplemented,
    getJsxFactoryEntity: notImplemented,
    getJsxFragmentFactoryEntity: notImplemented,
    isBindingCapturedByNode: notImplemented,
    getDeclarationStatementsForSourceFile: notImplemented,
    isImportRequiredByAugmentation: notImplemented,
    isDefinitelyReferenceToGlobalSymbolObject: notImplemented,
    createLateBoundIndexSignatures: notImplemented,
    symbolToDeclarations: notImplemented,
};
const enum PipelinePhase {
    Notification,
    Substitution,
    Comments,
    SourceMaps,
    Emit
}
/** @internal */
export const createPrinterWithDefaults: () => Printer = /* @__PURE__ */ memoize(() => createPrinter({}, {}));
/** @internal */
export const createPrinterWithRemoveComments: () => Printer = /* @__PURE__ */ memoize(() => createPrinter({}, { removeComments: true }));
/** @internal */
export const createPrinterWithRemoveCommentsNeverAsciiEscape: () => Printer = /* @__PURE__ */ memoize(() => createPrinter({}, { removeComments: true, neverAsciiEscape: true }));
/** @internal */
export const createPrinterWithRemoveCommentsOmitTrailingSemicolon: () => Printer = /* @__PURE__ */ memoize(() => createPrinter({}, { removeComments: true, omitTrailingSemicolon: true }));
export function createPrinter(extra: EmitterExtraContext, printerOptions: PrinterOptions = {}, handlers: PrintHandlers = {}): Printer {
    return new CPrinter(printerOptions, handlers, extra);
}
export class CPrinter {
    public printerOptions: PrinterOptions = {};
    public handlers: PrintHandlers = {};
    constructor(__printerOptions: PrinterOptions = {}, __handlers: PrintHandlers = {}, public extra: EmitterExtraContext) {
        this.printerOptions = __printerOptions;
        this.handlers = __handlers;
        /* eslint-enable no-var */
        this.reset();
        return this;
    }
    hasGlobalName = this.handlers.hasGlobalName;
    onEmitNode = this.handlers.onEmitNode ?? noEmitNotification;
    isEmitNotificationEnabled = this.handlers.isEmitNotificationEnabled;
    substituteNode = this.handlers.substituteNode ?? noEmitSubstitution;
    onBeforeEmitNode = this.handlers.onBeforeEmitNode;
    onAfterEmitNode = this.handlers.onAfterEmitNode;
    onBeforeEmitNodeArray = this.handlers.onBeforeEmitNodeArray;
    onAfterEmitNodeArray = this.handlers.onAfterEmitNodeArray;
    onBeforeEmitToken = this.handlers.onBeforeEmitToken;
    onAfterEmitToken = this.handlers.onAfterEmitToken;
    extendedDiagnostics = !!this.printerOptions.extendedDiagnostics;
    omitBraceSourcePositions = !!this.printerOptions.omitBraceSourceMapPositions;
    newLine = getNewLineCharacter(this.printerOptions);
    moduleKind = getEmitModuleKind(this.printerOptions);
    bundledHelpers = new Map<string, boolean>();
    currentSourceFile!: SourceFile | undefined;
    nodeIdToGeneratedName!: string[];
    nodeIdToGeneratedPrivateName!: string[];
    autoGeneratedIdToGeneratedName!: string[];
    generatedNames!: Set<string>;
    formattedNameTempFlagsStack!: (Map<string, TempFlags> | undefined)[];
    formattedNameTempFlags!: Map<string, TempFlags> | undefined;
    privateNameTempFlagsStack!: TempFlags[];
    privateNameTempFlags!: TempFlags;
    tempFlagsStack!: TempFlags[];
    tempFlags!: TempFlags;
    reservedNamesStack!: (Set<string> | undefined)[];
    reservedNames!: Set<string> | undefined;
    reservedPrivateNamesStack!: (Set<string> | undefined)[];
    reservedPrivateNames!: Set<string> | undefined;
    preserveSourceNewlines = this.printerOptions.preserveSourceNewlines;
    nextListElementPos!: number | undefined;
    writer!: EmitTextWriter;
    ownWriter!: EmitTextWriter;
    write = this.writeBase?.bind?.(this);
    isOwnFileEmit!: boolean;
    sourceMapsDisabled = true;
    sourceMapGenerator!: SourceMapGenerator | undefined;
    sourceMapSource!: SourceMapSource;
    sourceMapSourceIndex = -1;
    mostRecentlyAddedSourceMapSource!: SourceMapSource;
    mostRecentlyAddedSourceMapSourceIndex = -1;
    containerPos = -1;
    containerEnd = -1;
    declarationListContainerEnd = -1;
    currentLineMap!: readonly number[] | undefined;
    detachedCommentsInfo!: {
        nodePos: number;
        detachedCommentEndPos: number;
    }[] | undefined;
    hasWrittenComment = false;
    commentsDisabled = !!this.printerOptions.removeComments;
    lastSubstitution!: Node | undefined;
    currentParenthesizerRule!: ParenthesizerRule<any> | undefined;
    enterComment = (performance.createTimerIf)(this.extendedDiagnostics, "commentTime", "beforeComment", "afterComment").enter;
    exitComment = (performance.createTimerIf)(this.extendedDiagnostics, "commentTime", "beforeComment", "afterComment").exit;
    parenthesizer = factory.parenthesizer;
    typeArgumentParenthesizerRuleSelector: OrdinalParentheizerRuleSelector<TypeNode> = {
        select: index => index === 0 ? this.parenthesizer.parenthesizeLeadingTypeArgument : undefined,
    };
    emitBinaryExpression = this.createEmitBinaryExpression();
    public printNode(hint: EmitHint, node: Node, sourceFile: SourceFile): string {
        switch (hint) {
            case EmitHint.SourceFile:
                (Debug.assert)(isSourceFile(node), "Expected a SourceFile node.");
                break;
            case EmitHint.IdentifierName:
                (Debug.assert)(isIdentifier(node), "Expected an Identifier node.");
                break;
            case EmitHint.Expression:
                (Debug.assert)(isExpression(node), "Expected an Expression node.");
                break;
        }
        switch (node.kind) {
            case SyntaxKind.SourceFile:
                return this.printFile(node as SourceFile);
            case SyntaxKind.Bundle:
                return this.printBundle(node as Bundle);
        }
        this.writeNode(hint, node, sourceFile, this.beginPrint());
        return this.endPrint();
    }
    public printList<T extends Node>(format: ListFormat, nodes: NodeArray<T>, sourceFile: SourceFile) {
        this.writeList(format, nodes, sourceFile, this.beginPrint());
        return this.endPrint();
    }
    public printBundle(bundle: Bundle): string {
        this.writeBundle(bundle, this.beginPrint(), /*sourceMapGenerator*/ undefined);
        return this.endPrint();
    }
    public printFile(sourceFile: SourceFile): string {
        this.writeFile(sourceFile, this.beginPrint(), /*sourceMapGenerator*/ undefined);
        return this.endPrint();
    }
    public writeNode(hint: EmitHint, node: TypeNode, sourceFile: undefined, output: EmitTextWriter): void;
    public writeNode(hint: EmitHint, node: Node, sourceFile: SourceFile, output: EmitTextWriter): void;
    public writeNode(hint: EmitHint, node: Node, sourceFile: SourceFile | undefined, output: EmitTextWriter) {
        const previousWriter = this.writer;
        this.setWriter(output, /*_sourceMapGenerator*/ undefined);
        this.print(hint, node, sourceFile);
        this.reset();
        this.writer = previousWriter;
    }
    public writeList<T extends Node>(format: ListFormat, nodes: NodeArray<T>, sourceFile: SourceFile | undefined, output: EmitTextWriter) {
        const previousWriter = this.writer;
        this.setWriter(output, /*_sourceMapGenerator*/ undefined);
        if (sourceFile) {
            this.setSourceFile(sourceFile);
        }
        this.emitList(/*parentNode*/ undefined, nodes, format);
        this.reset();
        this.writer = previousWriter;
    }
    public writeBundle(bundle: Bundle, output: EmitTextWriter, sourceMapGenerator: SourceMapGenerator | undefined) {
        this.isOwnFileEmit = false;
        const previousWriter = this.writer;
        this.setWriter(output, sourceMapGenerator);
        this.emitShebangIfNeeded(bundle);
        this.emitPrologueDirectivesIfNeeded(bundle);
        this.emitHelpers(bundle);
        this.emitSyntheticTripleSlashReferencesIfNeeded(bundle);
        for (const sourceFile of bundle.sourceFiles) {
            this.print(EmitHint.SourceFile, sourceFile, sourceFile);
        }
        this.reset();
        this.writer = previousWriter;
    }
    public writeFile(sourceFile: SourceFile, output: EmitTextWriter, sourceMapGenerator: SourceMapGenerator | undefined) {
        this.isOwnFileEmit = true;
        const previousWriter = this.writer;
        this.setWriter(output, sourceMapGenerator);
        this.emitShebangIfNeeded(sourceFile);
        this.emitPrologueDirectivesIfNeeded(sourceFile);
        this.print(EmitHint.SourceFile, sourceFile, sourceFile);
        this.reset();
        this.writer = previousWriter;
    }
    public beginPrint() {
        return this.ownWriter || (this.ownWriter = createTextWriter(this.newLine));
    }
    public endPrint() {
        const text = (this.ownWriter.getText)();
        (this.ownWriter.clear)();
        return text;
    }
    public print(hint: EmitHint, node: Node, sourceFile: SourceFile | undefined) {
        if (sourceFile) {
            this.setSourceFile(sourceFile);
        }
        this.pipelineEmit(hint, node, /*parenthesizerRule*/ undefined);
    }
    public setSourceFile(sourceFile: SourceFile | undefined) {
        this.currentSourceFile = sourceFile;
        this.currentLineMap = undefined;
        this.detachedCommentsInfo = undefined;
        if (sourceFile) {
            this.setSourceMapSource(sourceFile);
        }
    }
    public setWriter(_writer: EmitTextWriter | undefined, _sourceMapGenerator: SourceMapGenerator | undefined) {
        if (_writer && this.printerOptions.omitTrailingSemicolon) {
            _writer = getTrailingSemicolonDeferringWriter(_writer);
        }
        this.writer = _writer!; // TODO: GH#18217
        this.sourceMapGenerator = _sourceMapGenerator;
        this.sourceMapsDisabled = !this.writer || !this.sourceMapGenerator;
    }
    public reset() {
        this.nodeIdToGeneratedName = [];
        this.nodeIdToGeneratedPrivateName = [];
        this.autoGeneratedIdToGeneratedName = [];
        this.generatedNames = new Set();
        this.formattedNameTempFlagsStack = [];
        this.formattedNameTempFlags = new Map();
        this.privateNameTempFlagsStack = [];
        this.privateNameTempFlags = TempFlags.Auto;
        this.tempFlagsStack = [];
        this.tempFlags = TempFlags.Auto;
        this.reservedNamesStack = [];
        this.reservedNames = undefined;
        this.reservedPrivateNamesStack = [];
        this.reservedPrivateNames = undefined;
        this.currentSourceFile = undefined;
        this.currentLineMap = undefined;
        this.detachedCommentsInfo = undefined;
        this.setWriter(/*output*/ undefined, /*_sourceMapGenerator*/ undefined);
    }
    public getCurrentLineMap() {
        return this.currentLineMap || (this.currentLineMap = getLineStarts((Debug.checkDefined)(this.currentSourceFile)));
    }
    public emit<T extends Node>(node: T, parenthesizerRule?: (node: T) => T): void;
    public emit<T extends Node>(node: T | undefined, parenthesizerRule?: (node: T) => T): void;
    public emit<T extends Node>(node: T | undefined, parenthesizerRule?: (node: T) => T) {
        if (node === undefined)
            return;
        this.pipelineEmit(EmitHint.Unspecified, node, parenthesizerRule);
    }
    public emitIdentifierName(node: Identifier): void;
    public emitIdentifierName(node: Identifier | undefined): void;
    public emitIdentifierName(node: Identifier | undefined) {
        if (node === undefined)
            return;
        this.pipelineEmit(EmitHint.IdentifierName, node, /*parenthesizerRule*/ undefined);
    }
    public emitExpression<T extends Expression>(node: T, parenthesizerRule?: (node: T) => T): void;
    public emitExpression<T extends Expression>(node: T | undefined, parenthesizerRule?: (node: T) => T): void;
    public emitExpression<T extends Expression>(node: T | undefined, parenthesizerRule?: (node: T) => T) {
        if (node === undefined)
            return;
        this.pipelineEmit(EmitHint.Expression, node, parenthesizerRule);
    }
    public emitJsxAttributeValue(node: JsxAttributeValue): void {
        this.pipelineEmit(isStringLiteral(node) ? EmitHint.JsxAttributeValue : EmitHint.Unspecified, node);
    }
    public beforeEmitNode(node: Node) {
        if (this.preserveSourceNewlines && (getInternalEmitFlags(node) & InternalEmitFlags.IgnoreSourceNewlines)) {
            this.preserveSourceNewlines = false;
        }
    }
    public afterEmitNode(savedPreserveSourceNewlines: boolean | undefined) {
        this.preserveSourceNewlines = savedPreserveSourceNewlines;
    }
    public pipelineEmit<T extends Node>(emitHint: EmitHint, node: T, parenthesizerRule?: (node: T) => T) {
        this.currentParenthesizerRule = parenthesizerRule;
        const pipelinePhase = this.getPipelinePhase(PipelinePhase.Notification, emitHint, node);
        pipelinePhase(emitHint, node);
        this.currentParenthesizerRule = undefined;
    }
    public shouldEmitComments(node: Node) {
        return !this.commentsDisabled && !isSourceFile(node);
    }
    public shouldEmitSourceMaps(node: Node) {
        return !this.sourceMapsDisabled &&
            !isSourceFile(node) &&
            !isInJsonFile(node);
    }
    public getPipelinePhase(phase: PipelinePhase, emitHint: EmitHint, node: Node) {
        switch (phase) {
            case PipelinePhase.Notification:
                if (this.onEmitNode !== noEmitNotification && (!this.isEmitNotificationEnabled || this.isEmitNotificationEnabled(node))) {
                    return this.pipelineEmitWithNotification?.bind?.(this);
                }
            // falls through
            case PipelinePhase.Substitution:
                if (this.substituteNode !== noEmitSubstitution && (this.lastSubstitution = this.substituteNode(emitHint, node) || node) !== node) {
                    if (this.currentParenthesizerRule) {
                        this.lastSubstitution = this.currentParenthesizerRule(this.lastSubstitution);
                    }
                    return this.pipelineEmitWithSubstitution?.bind?.(this);
                }
            // falls through
            case PipelinePhase.Comments:
                if (this.shouldEmitComments(node)) {
                    return this.pipelineEmitWithComments?.bind?.(this);
                }
            // falls through
            case PipelinePhase.SourceMaps:
                if (this.shouldEmitSourceMaps(node)) {
                    return this.pipelineEmitWithSourceMaps?.bind?.(this);
                }
            // falls through
            case PipelinePhase.Emit:
                return this.pipelineEmitWithHint?.bind?.(this);
            default:
                return (Debug.assertNever)(phase);
        }
    }
    public getNextPipelinePhase(currentPhase: PipelinePhase, emitHint: EmitHint, node: Node) {
        return this.getPipelinePhase(currentPhase + 1, emitHint, node);
    }
    public pipelineEmitWithNotification(hint: EmitHint, node: Node) {
        const pipelinePhase = this.getNextPipelinePhase(PipelinePhase.Notification, hint, node);
        this.onEmitNode(hint, node, pipelinePhase);
    }
    public pipelineEmitWithHint(hint: EmitHint, node: Node): void {
        this.onBeforeEmitNode?.(node);
        if (this.preserveSourceNewlines) {
            const savedPreserveSourceNewlines = this.preserveSourceNewlines;
            this.beforeEmitNode(node);
            this.pipelineEmitWithHintWorker(hint, node);
            this.afterEmitNode(savedPreserveSourceNewlines);
        }
        else {
            this.pipelineEmitWithHintWorker(hint, node);
        }
        this.onAfterEmitNode?.(node);
        // clear the parenthesizer rule as we ascend
        this.currentParenthesizerRule = undefined;
    }
    public pipelineEmitWithHintWorker(hint: EmitHint, node: Node, allowSnippets = true): void {
        if (allowSnippets) {
            const snippet = getSnippetElement(node);
            if (snippet) {
                return this.emitSnippetNode(hint, node, snippet);
            }
        }
        if (hint === EmitHint.SourceFile)
            return this.emitSourceFile(cast(node, isSourceFile));
        if (hint === EmitHint.IdentifierName)
            return this.emitIdentifier(cast(node, isIdentifier));
        if (hint === EmitHint.JsxAttributeValue)
            return this.emitLiteral(cast(node, isStringLiteral), /*jsxAttributeEscape*/ true);
        if (hint === EmitHint.MappedTypeParameter)
            return this.emitMappedTypeParameter(cast(node, isTypeParameterDeclaration));
        if (hint === EmitHint.ImportTypeNodeAttributes)
            return this.emitImportTypeNodeAttributes(cast(node, isImportAttributes));
        if (hint === EmitHint.EmbeddedStatement) {
            (Debug.assertNode)(node, isEmptyStatement);
            return this.emitEmptyStatement(/*isEmbeddedStatement*/ true);
        }
        if (hint === EmitHint.Unspecified) {
            switch (node.kind) {
                // Pseudo-literals
                case SyntaxKind.TemplateHead:
                case SyntaxKind.TemplateMiddle:
                case SyntaxKind.TemplateTail:
                    return this.emitLiteral(node as LiteralExpression, /*jsxAttributeEscape*/ false);
                // Identifiers
                case SyntaxKind.Identifier:
                    return this.emitIdentifier(node as Identifier);
                // PrivateIdentifiers
                case SyntaxKind.PrivateIdentifier:
                    return this.emitPrivateIdentifier(node as PrivateIdentifier);
                // Parse tree nodes
                // Names
                case SyntaxKind.QualifiedName:
                    return this.emitQualifiedName(node as QualifiedName);
                case SyntaxKind.ComputedPropertyName:
                    return this.emitComputedPropertyName(node as ComputedPropertyName);
                // Signature elements
                case SyntaxKind.TypeParameter:
                    return this.emitTypeParameter(node as TypeParameterDeclaration);
                case SyntaxKind.Parameter:
                    return this.emitParameter(node as ParameterDeclaration);
                case SyntaxKind.Decorator:
                    return this.emitDecorator(node as Decorator);
                // Type members
                case SyntaxKind.PropertySignature:
                    return this.emitPropertySignature(node as PropertySignature);
                case SyntaxKind.PropertyDeclaration:
                    return this.emitPropertyDeclaration(node as PropertyDeclaration);
                case SyntaxKind.MethodSignature:
                    return this.emitMethodSignature(node as MethodSignature);
                case SyntaxKind.MethodDeclaration:
                    return this.emitMethodDeclaration(node as MethodDeclaration);
                case SyntaxKind.ClassStaticBlockDeclaration:
                    return this.emitClassStaticBlockDeclaration(node as ClassStaticBlockDeclaration);
                case SyntaxKind.Constructor:
                    return this.emitConstructor(node as ConstructorDeclaration);
                case SyntaxKind.GetAccessor:
                case SyntaxKind.SetAccessor:
                    return this.emitAccessorDeclaration(node as AccessorDeclaration);
                case SyntaxKind.CallSignature:
                    return this.emitCallSignature(node as CallSignatureDeclaration);
                case SyntaxKind.ConstructSignature:
                    return this.emitConstructSignature(node as ConstructSignatureDeclaration);
                case SyntaxKind.IndexSignature:
                    return this.emitIndexSignature(node as IndexSignatureDeclaration);
                // Types
                case SyntaxKind.TypePredicate:
                    return this.emitTypePredicate(node as TypePredicateNode);
                case SyntaxKind.TypeReference:
                    return this.emitTypeReference(node as TypeReferenceNode);
                case SyntaxKind.FunctionType:
                    return this.emitFunctionType(node as FunctionTypeNode);
                case SyntaxKind.ConstructorType:
                    return this.emitConstructorType(node as ConstructorTypeNode);
                case SyntaxKind.TypeQuery:
                    return this.emitTypeQuery(node as TypeQueryNode);
                case SyntaxKind.TypeLiteral:
                    return this.emitTypeLiteral(node as TypeLiteralNode);
                case SyntaxKind.ArrayType:
                    return this.emitArrayType(node as ArrayTypeNode);
                case SyntaxKind.TupleType:
                    return this.emitTupleType(node as TupleTypeNode);
                case SyntaxKind.OptionalType:
                    return this.emitOptionalType(node as OptionalTypeNode);
                // SyntaxKind.RestType is handled below
                case SyntaxKind.UnionType:
                    return this.emitUnionType(node as UnionTypeNode);
                case SyntaxKind.IntersectionType:
                    return this.emitIntersectionType(node as IntersectionTypeNode);
                case SyntaxKind.ConditionalType:
                    return this.emitConditionalType(node as ConditionalTypeNode);
                case SyntaxKind.InferType:
                    return this.emitInferType(node as InferTypeNode);
                case SyntaxKind.ParenthesizedType:
                    return this.emitParenthesizedType(node as ParenthesizedTypeNode);
                case SyntaxKind.ExpressionWithTypeArguments:
                    return this.emitExpressionWithTypeArguments(node as ExpressionWithTypeArguments);
                case SyntaxKind.ThisType:
                    return this.emitThisType();
                case SyntaxKind.TypeOperator:
                    return this.emitTypeOperator(node as TypeOperatorNode);
                case SyntaxKind.IndexedAccessType:
                    return this.emitIndexedAccessType(node as IndexedAccessTypeNode);
                case SyntaxKind.MappedType:
                    return this.emitMappedType(node as MappedTypeNode);
                case SyntaxKind.LiteralType:
                    return this.emitLiteralType(node as LiteralTypeNode);
                case SyntaxKind.NamedTupleMember:
                    return this.emitNamedTupleMember(node as NamedTupleMember);
                case SyntaxKind.TemplateLiteralType:
                    return this.emitTemplateType(node as TemplateLiteralTypeNode);
                case SyntaxKind.TemplateLiteralTypeSpan:
                    return this.emitTemplateTypeSpan(node as TemplateLiteralTypeSpan);
                case SyntaxKind.ImportType:
                    return this.emitImportTypeNode(node as ImportTypeNode);
                // Binding patterns
                case SyntaxKind.ObjectBindingPattern:
                    return this.emitObjectBindingPattern(node as ObjectBindingPattern);
                case SyntaxKind.ArrayBindingPattern:
                    return this.emitArrayBindingPattern(node as ArrayBindingPattern);
                case SyntaxKind.BindingElement:
                    return this.emitBindingElement(node as BindingElement);
                // Misc
                case SyntaxKind.TemplateSpan:
                    return this.emitTemplateSpan(node as TemplateSpan);
                case SyntaxKind.SemicolonClassElement:
                    return this.emitSemicolonClassElement();
                // Statements
                case SyntaxKind.Block:
                    return this.emitBlock(node as Block);
                case SyntaxKind.VariableStatement:
                    return this.emitVariableStatement(node as VariableStatement);
                case SyntaxKind.EmptyStatement:
                    return this.emitEmptyStatement(/*isEmbeddedStatement*/ false);
                case SyntaxKind.ExpressionStatement:
                    return this.emitExpressionStatement(node as ExpressionStatement);
                case SyntaxKind.IfStatement:
                    return this.emitIfStatement(node as IfStatement);
                case SyntaxKind.DoStatement:
                    return this.emitDoStatement(node as DoStatement);
                case SyntaxKind.WhileStatement:
                    return this.emitWhileStatement(node as WhileStatement);
                case SyntaxKind.ForStatement:
                    return this.emitForStatement(node as ForStatement);
                case SyntaxKind.ForInStatement:
                    return this.emitForInStatement(node as ForInStatement);
                case SyntaxKind.ForOfStatement:
                    return this.emitForOfStatement(node as ForOfStatement);
                case SyntaxKind.ContinueStatement:
                    return this.emitContinueStatement(node as ContinueStatement);
                case SyntaxKind.BreakStatement:
                    return this.emitBreakStatement(node as BreakStatement);
                case SyntaxKind.ReturnStatement:
                    return this.emitReturnStatement(node as ReturnStatement);
                case SyntaxKind.WithStatement:
                    return this.emitWithStatement(node as WithStatement);
                case SyntaxKind.SwitchStatement:
                    return this.emitSwitchStatement(node as SwitchStatement);
                case SyntaxKind.LabeledStatement:
                    return this.emitLabeledStatement(node as LabeledStatement);
                case SyntaxKind.ThrowStatement:
                    return this.emitThrowStatement(node as ThrowStatement);
                case SyntaxKind.TryStatement:
                    return this.emitTryStatement(node as TryStatement);
                case SyntaxKind.DebuggerStatement:
                    return this.emitDebuggerStatement(node as DebuggerStatement);
                // Declarations
                case SyntaxKind.VariableDeclaration:
                    return this.emitVariableDeclaration(node as VariableDeclaration);
                case SyntaxKind.VariableDeclarationList:
                    return this.emitVariableDeclarationList(node as VariableDeclarationList);
                case SyntaxKind.FunctionDeclaration:
                    return this.emitFunctionDeclaration(node as FunctionDeclaration);
                case SyntaxKind.ClassDeclaration:
                    return this.emitClassDeclaration(node as ClassDeclaration);
                case SyntaxKind.InterfaceDeclaration:
                    return this.emitInterfaceDeclaration(node as InterfaceDeclaration);
                case SyntaxKind.TypeAliasDeclaration:
                    return this.emitTypeAliasDeclaration(node as TypeAliasDeclaration);
                case SyntaxKind.EnumDeclaration:
                    return this.emitEnumDeclaration(node as EnumDeclaration);
                case SyntaxKind.ModuleDeclaration:
                    return this.emitModuleDeclaration(node as ModuleDeclaration);
                case SyntaxKind.ModuleBlock:
                    return this.emitModuleBlock(node as ModuleBlock);
                case SyntaxKind.CaseBlock:
                    return this.emitCaseBlock(node as CaseBlock);
                case SyntaxKind.NamespaceExportDeclaration:
                    return this.emitNamespaceExportDeclaration(node as NamespaceExportDeclaration);
                case SyntaxKind.ImportEqualsDeclaration:
                    return this.emitImportEqualsDeclaration(node as ImportEqualsDeclaration);
                case SyntaxKind.ImportDeclaration:
                    return this.emitImportDeclaration(node as ImportDeclaration);
                case SyntaxKind.ImportClause:
                    return this.emitImportClause(node as ImportClause);
                case SyntaxKind.NamespaceImport:
                    return this.emitNamespaceImport(node as NamespaceImport);
                case SyntaxKind.NamespaceExport:
                    return this.emitNamespaceExport(node as NamespaceExport);
                case SyntaxKind.NamedImports:
                    return this.emitNamedImports(node as NamedImports);
                case SyntaxKind.ImportSpecifier:
                    return this.emitImportSpecifier(node as ImportSpecifier);
                case SyntaxKind.ExportAssignment:
                    return this.emitExportAssignment(node as ExportAssignment);
                case SyntaxKind.ExportDeclaration:
                    return this.emitExportDeclaration(node as ExportDeclaration);
                case SyntaxKind.NamedExports:
                    return this.emitNamedExports(node as NamedExports);
                case SyntaxKind.ExportSpecifier:
                    return this.emitExportSpecifier(node as ExportSpecifier);
                case SyntaxKind.ImportAttributes:
                    return this.emitImportAttributes(node as ImportAttributes);
                case SyntaxKind.ImportAttribute:
                    return this.emitImportAttribute(node as ImportAttribute);
                case SyntaxKind.MissingDeclaration:
                    return;
                // Module references
                case SyntaxKind.ExternalModuleReference:
                    return this.emitExternalModuleReference(node as ExternalModuleReference);
                // JSX (non-expression)
                case SyntaxKind.JsxText:
                    return this.emitJsxText(node as JsxText);
                case SyntaxKind.JsxOpeningElement:
                case SyntaxKind.JsxOpeningFragment:
                    return this.emitJsxOpeningElementOrFragment(node as JsxOpeningElement);
                case SyntaxKind.JsxClosingElement:
                case SyntaxKind.JsxClosingFragment:
                    return this.emitJsxClosingElementOrFragment(node as JsxClosingElement);
                case SyntaxKind.JsxAttribute:
                    return this.emitJsxAttribute(node as JsxAttribute);
                case SyntaxKind.JsxAttributes:
                    return this.emitJsxAttributes(node as JsxAttributes);
                case SyntaxKind.JsxSpreadAttribute:
                    return this.emitJsxSpreadAttribute(node as JsxSpreadAttribute);
                case SyntaxKind.JsxExpression:
                    return this.emitJsxExpression(node as JsxExpression);
                case SyntaxKind.JsxNamespacedName:
                    return this.emitJsxNamespacedName(node as JsxNamespacedName);
                // Clauses
                case SyntaxKind.CaseClause:
                    return this.emitCaseClause(node as CaseClause);
                case SyntaxKind.DefaultClause:
                    return this.emitDefaultClause(node as DefaultClause);
                case SyntaxKind.HeritageClause:
                    return this.emitHeritageClause(node as HeritageClause);
                case SyntaxKind.CatchClause:
                    return this.emitCatchClause(node as CatchClause);
                // Property assignments
                case SyntaxKind.PropertyAssignment:
                    return this.emitPropertyAssignment(node as PropertyAssignment);
                case SyntaxKind.ShorthandPropertyAssignment:
                    return this.emitShorthandPropertyAssignment(node as ShorthandPropertyAssignment);
                case SyntaxKind.SpreadAssignment:
                    return this.emitSpreadAssignment(node as SpreadAssignment);
                // Enum
                case SyntaxKind.EnumMember:
                    return this.emitEnumMember(node as EnumMember);
                // Top-level nodes
                case SyntaxKind.SourceFile:
                    return this.emitSourceFile(node as SourceFile);
                case SyntaxKind.Bundle:
                    return (Debug.fail)("Bundles should be printed using printBundle");
                // JSDoc nodes (only used in codefixes currently)
                case SyntaxKind.JSDocTypeExpression:
                    return this.emitJSDocTypeExpression(node as JSDocTypeExpression);
                case SyntaxKind.JSDocNameReference:
                    return this.emitJSDocNameReference(node as JSDocNameReference);
                case SyntaxKind.JSDocAllType:
                    return this.writePunctuation("*");
                case SyntaxKind.JSDocUnknownType:
                    return this.writePunctuation("?");
                case SyntaxKind.JSDocNullableType:
                    return this.emitJSDocNullableType(node as JSDocNullableType);
                case SyntaxKind.JSDocNonNullableType:
                    return this.emitJSDocNonNullableType(node as JSDocNonNullableType);
                case SyntaxKind.JSDocOptionalType:
                    return this.emitJSDocOptionalType(node as JSDocOptionalType);
                case SyntaxKind.JSDocFunctionType:
                    return this.emitJSDocFunctionType(node as JSDocFunctionType);
                case SyntaxKind.RestType:
                case SyntaxKind.JSDocVariadicType:
                    return this.emitRestOrJSDocVariadicType(node as RestTypeNode | JSDocVariadicType);
                case SyntaxKind.JSDocNamepathType:
                    return;
                case SyntaxKind.JSDoc:
                    return this.emitJSDoc(node as JSDoc);
                case SyntaxKind.JSDocTypeLiteral:
                    return this.emitJSDocTypeLiteral(node as JSDocTypeLiteral);
                case SyntaxKind.JSDocSignature:
                    return this.emitJSDocSignature(node as JSDocSignature);
                case SyntaxKind.JSDocTag:
                case SyntaxKind.JSDocClassTag:
                case SyntaxKind.JSDocOverrideTag:
                    return this.emitJSDocSimpleTag(node as JSDocTag);
                case SyntaxKind.JSDocAugmentsTag:
                case SyntaxKind.JSDocImplementsTag:
                    return this.emitJSDocHeritageTag(node as JSDocImplementsTag | JSDocAugmentsTag);
                case SyntaxKind.JSDocAuthorTag:
                case SyntaxKind.JSDocDeprecatedTag:
                    return;
                // SyntaxKind.JSDocClassTag (see JSDocTag, above)
                case SyntaxKind.JSDocPublicTag:
                case SyntaxKind.JSDocPrivateTag:
                case SyntaxKind.JSDocProtectedTag:
                case SyntaxKind.JSDocReadonlyTag:
                    return;
                case SyntaxKind.JSDocCallbackTag:
                    return this.emitJSDocCallbackTag(node as JSDocCallbackTag);
                case SyntaxKind.JSDocOverloadTag:
                    return this.emitJSDocOverloadTag(node as JSDocOverloadTag);
                // SyntaxKind.JSDocEnumTag (see below)
                case SyntaxKind.JSDocParameterTag:
                case SyntaxKind.JSDocPropertyTag:
                    return this.emitJSDocPropertyLikeTag(node as JSDocPropertyLikeTag);
                case SyntaxKind.JSDocEnumTag:
                case SyntaxKind.JSDocReturnTag:
                case SyntaxKind.JSDocThisTag:
                case SyntaxKind.JSDocTypeTag:
                case SyntaxKind.JSDocThrowsTag:
                case SyntaxKind.JSDocSatisfiesTag:
                    return this.emitJSDocSimpleTypedTag(node as JSDocTypeTag | JSDocReturnTag | JSDocThisTag | JSDocTypeTag | JSDocThrowsTag | JSDocSatisfiesTag);
                case SyntaxKind.JSDocTemplateTag:
                    return this.emitJSDocTemplateTag(node as JSDocTemplateTag);
                case SyntaxKind.JSDocTypedefTag:
                    return this.emitJSDocTypedefTag(node as JSDocTypedefTag);
                case SyntaxKind.JSDocSeeTag:
                    return this.emitJSDocSeeTag(node as JSDocSeeTag);
                case SyntaxKind.JSDocImportTag:
                    return this.emitJSDocImportTag(node as JSDocImportTag);
                // SyntaxKind.JSDocPropertyTag (see JSDocParameterTag, above)
                // Transformation nodes
                case SyntaxKind.NotEmittedStatement:
                case SyntaxKind.NotEmittedTypeElement:
                    return;
            }
            if (isExpression(node)) {
                hint = EmitHint.Expression;
                if (this.substituteNode !== noEmitSubstitution) {
                    const substitute = this.substituteNode(hint, node) || node;
                    if (substitute !== node) {
                        node = substitute;
                        if (this.currentParenthesizerRule) {
                            node = this.currentParenthesizerRule(node);
                        }
                    }
                }
            }
        }
        if (hint === EmitHint.Expression) {
            switch (node.kind) {
                // Literals
                case SyntaxKind.NumericLiteral:
                case SyntaxKind.BigIntLiteral:
                    return this.emitNumericOrBigIntLiteral(node as NumericLiteral | BigIntLiteral);
                case SyntaxKind.StringLiteral:
                case SyntaxKind.RegularExpressionLiteral:
                case SyntaxKind.NoSubstitutionTemplateLiteral:
                    return this.emitLiteral(node as LiteralExpression, /*jsxAttributeEscape*/ false);
                // Identifiers
                case SyntaxKind.Identifier:
                    return this.emitIdentifier(node as Identifier);
                case SyntaxKind.PrivateIdentifier:
                    return this.emitPrivateIdentifier(node as PrivateIdentifier);
                // Expressions
                case SyntaxKind.ArrayLiteralExpression:
                    return this.emitArrayLiteralExpression(node as ArrayLiteralExpression);
                case SyntaxKind.ObjectLiteralExpression:
                    return this.emitObjectLiteralExpression(node as ObjectLiteralExpression);
                case SyntaxKind.PropertyAccessExpression:
                    return this.emitPropertyAccessExpression(node as PropertyAccessExpression);
                case SyntaxKind.ElementAccessExpression:
                    return this.emitElementAccessExpression(node as ElementAccessExpression);
                case SyntaxKind.CallExpression:
                    return this.emitCallExpression(node as CallExpression);
                case SyntaxKind.NewExpression:
                    return this.emitNewExpression(node as NewExpression);
                case SyntaxKind.TaggedTemplateExpression:
                    return this.emitTaggedTemplateExpression(node as TaggedTemplateExpression);
                case SyntaxKind.TypeAssertionExpression:
                    return this.emitTypeAssertionExpression(node as TypeAssertion);
                case SyntaxKind.ParenthesizedExpression:
                    return this.emitParenthesizedExpression(node as ParenthesizedExpression);
                case SyntaxKind.FunctionExpression:
                    return this.emitFunctionExpression(node as FunctionExpression);
                case SyntaxKind.ArrowFunction:
                    return this.emitArrowFunction(node as ArrowFunction);
                case SyntaxKind.DeleteExpression:
                    return this.emitDeleteExpression(node as DeleteExpression);
                case SyntaxKind.TypeOfExpression:
                    return this.emitTypeOfExpression(node as TypeOfExpression);
                case SyntaxKind.VoidExpression:
                    return this.emitVoidExpression(node as VoidExpression);
                case SyntaxKind.AwaitExpression:
                    return this.emitAwaitExpression(node as AwaitExpression);
                case SyntaxKind.PrefixUnaryExpression:
                    return this.emitPrefixUnaryExpression(node as PrefixUnaryExpression);
                case SyntaxKind.PostfixUnaryExpression:
                    return this.emitPostfixUnaryExpression(node as PostfixUnaryExpression);
                case SyntaxKind.BinaryExpression:
                    return this.emitBinaryExpression(node as BinaryExpression);
                case SyntaxKind.ConditionalExpression:
                    return this.emitConditionalExpression(node as ConditionalExpression);
                case SyntaxKind.TemplateExpression:
                    return this.emitTemplateExpression(node as TemplateExpression);
                case SyntaxKind.YieldExpression:
                    return this.emitYieldExpression(node as YieldExpression);
                case SyntaxKind.SpreadElement:
                    return this.emitSpreadElement(node as SpreadElement);
                case SyntaxKind.ClassExpression:
                    return this.emitClassExpression(node as ClassExpression);
                case SyntaxKind.OmittedExpression:
                    return;
                case SyntaxKind.AsExpression:
                    return this.emitAsExpression(node as AsExpression);
                case SyntaxKind.NonNullExpression:
                    return this.emitNonNullExpression(node as NonNullExpression);
                case SyntaxKind.ExpressionWithTypeArguments:
                    return this.emitExpressionWithTypeArguments(node as ExpressionWithTypeArguments);
                case SyntaxKind.SatisfiesExpression:
                    return this.emitSatisfiesExpression(node as SatisfiesExpression);
                case SyntaxKind.MetaProperty:
                    return this.emitMetaProperty(node as MetaProperty);
                case SyntaxKind.SyntheticExpression:
                    return (Debug.fail)("SyntheticExpression should never be printed.");
                case SyntaxKind.MissingDeclaration:
                    return;
                // JSX
                case SyntaxKind.JsxElement:
                    return this.emitJsxElement(node as JsxElement);
                case SyntaxKind.JsxSelfClosingElement:
                    return this.emitJsxSelfClosingElement(node as JsxSelfClosingElement);
                case SyntaxKind.JsxFragment:
                    return this.emitJsxFragment(node as JsxFragment);
                // Synthesized list
                case SyntaxKind.SyntaxList:
                    return (Debug.fail)("SyntaxList should not be printed");
                // Transformation nodes
                case SyntaxKind.NotEmittedStatement:
                    return;
                case SyntaxKind.PartiallyEmittedExpression:
                    return this.emitPartiallyEmittedExpression(node as PartiallyEmittedExpression);
                case SyntaxKind.CommaListExpression:
                    return this.emitCommaList(node as CommaListExpression);
                case SyntaxKind.SyntheticReferenceExpression:
                    return (Debug.fail)("SyntheticReferenceExpression should not be printed");
            }
        }
        if (isKeyword(node.kind))
            return this.writeTokenNode(node, this.writeKeyword?.bind?.(this));
        if (isTokenKind(node.kind))
            return this.writeTokenNode(node, this.writePunctuation?.bind?.(this));
        (Debug.fail)(`Unhandled SyntaxKind: ${(Debug.formatSyntaxKind)(node.kind)}.`);
    }
    public emitMappedTypeParameter(node: TypeParameterDeclaration): void {
        this.emit(node.name);
        this.writeSpace();
        this.writeKeyword("in");
        this.writeSpace();
        this.emit(node.constraint);
    }
    public pipelineEmitWithSubstitution(hint: EmitHint, node: Node) {
        const pipelinePhase = this.getNextPipelinePhase(PipelinePhase.Substitution, hint, node);
        (Debug.assertIsDefined)(this.lastSubstitution);
        node = this.lastSubstitution;
        this.lastSubstitution = undefined;
        pipelinePhase(hint, node);
    }
    public emitHelpers(node: Node) {
        let helpersEmitted = false;
        const bundle = node.kind === SyntaxKind.Bundle ? node as Bundle : undefined;
        if (bundle && this.moduleKind === ModuleKind.None) {
            return;
        }
        const numNodes = bundle ? bundle.sourceFiles.length : 1;
        for (let i = 0; i < numNodes; i++) {
            const currentNode = bundle ? (bundle.sourceFiles)[i] : node;
            const sourceFile = isSourceFile(currentNode) ? currentNode : this.currentSourceFile;
            const shouldSkip = this.printerOptions.noEmitHelpers || (!!sourceFile && hasRecordedExternalHelpers(sourceFile));
            const shouldBundle = isSourceFile(currentNode) && !this.isOwnFileEmit;
            const helpers = this.getSortedEmitHelpers(currentNode);
            if (helpers) {
                for (const helper of helpers) {
                    if (!helper.scoped) {
                        // Skip the helper if it can be skipped and the noEmitHelpers compiler
                        // option is set, or if it can be imported and the importHelpers compiler
                        // option is set.
                        if (shouldSkip)
                            continue;
                        // Skip the helper if it can be bundled but hasn't already been emitted and we
                        // are emitting a bundled module.
                        if (shouldBundle) {
                            if ((this.bundledHelpers.get)(helper.name)) {
                                continue;
                            }
                            (this.bundledHelpers.set)(helper.name, true);
                        }
                    }
                    else if (bundle) {
                        // Skip the helper if it is scoped and we are emitting bundled helpers
                        continue;
                    }
                    if (typeof helper.text === "string") {
                        this.writeLines(helper.text);
                    }
                    else {
                        this.writeLines((helper.text)(this.makeFileLevelOptimisticUniqueName?.bind?.(this)));
                    }
                    helpersEmitted = true;
                }
            }
        }
        return helpersEmitted;
    }
    public getSortedEmitHelpers(node: Node) {
        const helpers = getEmitHelpers(node);
        return helpers && toSorted(helpers, compareEmitHelpers);
    }
    public emitNumericOrBigIntLiteral(node: NumericLiteral | BigIntLiteral) {
        this.emitLiteral(node, /*jsxAttributeEscape*/ false);
    }
    public emitLiteral(node: LiteralLikeNode, jsxAttributeEscape: boolean) {
        const text = this.getLiteralTextOfNode(node, /*sourceFile*/ undefined, this.printerOptions.neverAsciiEscape, jsxAttributeEscape);
        if ((this.printerOptions.sourceMap || this.printerOptions.inlineSourceMap)
            && (node.kind === SyntaxKind.StringLiteral || isTemplateLiteralKind(node.kind))) {
            this.writeLiteral(text);
        }
        else {
            // Quick info expects all literals to be called with writeStringLiteral, as there's no specific type for numberLiterals
            this.writeStringLiteral(text);
        }
    }
    public emitSnippetNode(hint: EmitHint, node: Node, snippet: SnippetElement) {
        switch (snippet.kind) {
            case SnippetKind.Placeholder:
                this.emitPlaceholder(hint, node, snippet);
                break;
            case SnippetKind.TabStop:
                this.emitTabStop(hint, node, snippet);
                break;
        }
    }
    public emitPlaceholder(hint: EmitHint, node: Node, snippet: Placeholder) {
        this.nonEscapingWrite(`$\{${snippet.order}:`); // `${2:`
        this.pipelineEmitWithHintWorker(hint, node, /*allowSnippets*/ false); // `...`
        this.nonEscapingWrite(`}`); // `}`
        // `${2:...}`
    }
    public emitTabStop(hint: EmitHint, node: Node, snippet: TabStop) {
        // A tab stop should only be attached to an empty node, i.e. a node that doesn't emit any text.
        (Debug.assert)(node.kind === SyntaxKind.EmptyStatement, `A tab stop cannot be attached to a node of kind ${(Debug.formatSyntaxKind)(node.kind)}.`);
        (Debug.assert)(hint !== EmitHint.EmbeddedStatement, `A tab stop cannot be attached to an embedded statement.`);
        this.nonEscapingWrite(`$${snippet.order}`);
    }
    public emitIdentifier(node: Identifier) {
        const writeText = node.symbol ? this.writeSymbol?.bind?.(this) : this.write;
        writeText(this.getTextOfNode(node, /*includeTrivia*/ false), node.symbol);
        this.emitList(node, getIdentifierTypeArguments(node), ListFormat.TypeParameters); // Call emitList directly since it could be an array of TypeParameterDeclarations _or_ type arguments
    }
    public emitPrivateIdentifier(node: PrivateIdentifier) {
        this.write(this.getTextOfNode(node, /*includeTrivia*/ false));
    }
    public emitQualifiedName(node: QualifiedName) {
        this.emitEntityName(node.left);
        this.writePunctuation(".");
        this.emit(node.right);
    }
    public emitEntityName(node: EntityName) {
        if (node.kind === SyntaxKind.Identifier) {
            this.emitExpression(node);
        }
        else {
            this.emit(node);
        }
    }
    public emitComputedPropertyName(node: ComputedPropertyName) {
        this.writePunctuation("[");
        this.emitExpression(node.expression, this.parenthesizer.parenthesizeExpressionOfComputedPropertyName);
        this.writePunctuation("]");
    }
    public emitTypeParameter(node: TypeParameterDeclaration) {
        this.emitModifierList(node, node.modifiers);
        this.emit(node.name);
        if (node.constraint) {
            this.writeSpace();
            this.writeKeyword("extends");
            this.writeSpace();
            this.emit(node.constraint);
        }
        if (node.default) {
            this.writeSpace();
            this.writeOperator("=");
            this.writeSpace();
            this.emit(node.default);
        }
    }
    public emitParameter(node: ParameterDeclaration) {
        this.emitDecoratorsAndModifiers(node, node.modifiers, /*allowDecorators*/ true);
        this.emit(node.dotDotDotToken);
        this.emitNodeWithWriter(node.name, this.writeParameter?.bind?.(this));
        this.emit(node.questionToken);
        if (node.parent && node.parent.kind === SyntaxKind.JSDocFunctionType && !node.name) {
            this.emit(node.type);
        }
        else {
            this.emitTypeAnnotation(node.type);
        }
        // The comment position has to fallback to any present node within the parameterdeclaration because as it turns out, the parser can make parameter declarations with _just_ an initializer.
        this.emitInitializer(node.initializer, node.type ? node.type.end : node.questionToken ? node.questionToken.end : node.name ? node.name.end : node.modifiers ? node.modifiers.end : node.pos, node, this.parenthesizer.parenthesizeExpressionForDisallowedComma);
    }
    public emitDecorator(decorator: Decorator) {
        this.writePunctuation("@");
        this.emitExpression(decorator.expression, this.parenthesizer.parenthesizeLeftSideOfAccess);
    }
    public emitPropertySignature(node: PropertySignature) {
        this.emitModifierList(node, node.modifiers);
        this.emitNodeWithWriter(node.name, this.writeProperty?.bind?.(this));
        this.emit(node.questionToken);
        this.emitTypeAnnotation(node.type);
        this.writeTrailingSemicolon();
    }
    public emitPropertyDeclaration(node: PropertyDeclaration) {
        this.emitDecoratorsAndModifiers(node, node.modifiers, /*allowDecorators*/ true);
        this.emit(node.name);
        this.emit(node.questionToken);
        this.emit(node.exclamationToken);
        this.emitTypeAnnotation(node.type);
        this.emitInitializer(node.initializer, node.type ? node.type.end : node.questionToken ? node.questionToken.end : node.name.end, node);
        this.writeTrailingSemicolon();
    }
    public emitMethodSignature(node: MethodSignature) {
        this.emitModifierList(node, node.modifiers);
        this.emit(node.name);
        this.emit(node.questionToken);
        this.emitSignatureAndBody(node, this.emitSignatureHead?.bind?.(this), this.emitEmptyFunctionBody?.bind?.(this));
    }
    public emitMethodDeclaration(node: MethodDeclaration) {
        this.emitDecoratorsAndModifiers(node, node.modifiers, /*allowDecorators*/ true);
        this.emit(node.asteriskToken);
        this.emit(node.name);
        this.emit(node.questionToken);
        this.emitSignatureAndBody(node, this.emitSignatureHead?.bind?.(this), this.emitFunctionBody?.bind?.(this));
    }
    public emitClassStaticBlockDeclaration(node: ClassStaticBlockDeclaration) {
        this.writeKeyword("static");
        this.pushNameGenerationScope(node);
        this.emitBlockFunctionBody(node.body);
        this.popNameGenerationScope(node);
    }
    public emitConstructor(node: ConstructorDeclaration) {
        this.emitDecoratorsAndModifiers(node, node.modifiers, /*allowDecorators*/ false);
        this.writeKeyword("constructor");
        this.emitSignatureAndBody(node, this.emitSignatureHead?.bind?.(this), this.emitFunctionBody?.bind?.(this));
    }
    public emitAccessorDeclaration(node: AccessorDeclaration) {
        const pos = this.emitDecoratorsAndModifiers(node, node.modifiers, /*allowDecorators*/ true);
        const token = node.kind === SyntaxKind.GetAccessor ? SyntaxKind.GetKeyword : SyntaxKind.SetKeyword;
        this.emitTokenWithComment(token, pos, this.writeKeyword?.bind?.(this), node);
        this.writeSpace();
        this.emit(node.name);
        this.emitSignatureAndBody(node, this.emitSignatureHead?.bind?.(this), this.emitFunctionBody?.bind?.(this));
    }
    public emitCallSignature(node: CallSignatureDeclaration) {
        this.emitSignatureAndBody(node, this.emitSignatureHead?.bind?.(this), this.emitEmptyFunctionBody?.bind?.(this));
    }
    public emitConstructSignature(node: ConstructSignatureDeclaration) {
        this.writeKeyword("new");
        this.writeSpace();
        this.emitSignatureAndBody(node, this.emitSignatureHead?.bind?.(this), this.emitEmptyFunctionBody?.bind?.(this));
    }
    public emitIndexSignature(node: IndexSignatureDeclaration) {
        this.emitDecoratorsAndModifiers(node, node.modifiers, /*allowDecorators*/ false);
        this.emitParametersForIndexSignature(node, node.parameters);
        this.emitTypeAnnotation(node.type);
        this.writeTrailingSemicolon();
    }
    public emitTemplateTypeSpan(node: TemplateLiteralTypeSpan) {
        this.emit(node.type);
        this.emit(node.literal);
    }
    public emitSemicolonClassElement() {
        this.writeTrailingSemicolon();
    }
    public emitTypePredicate(node: TypePredicateNode) {
        if (node.assertsModifier) {
            this.emit(node.assertsModifier);
            this.writeSpace();
        }
        this.emit(node.parameterName);
        if (node.type) {
            this.writeSpace();
            this.writeKeyword("is");
            this.writeSpace();
            this.emit(node.type);
        }
    }
    public emitTypeReference(node: TypeReferenceNode) {
        this.emit(node.typeName);
        this.emitTypeArguments(node, node.typeArguments);
    }
    public emitFunctionType(node: FunctionTypeNode) {
        this.emitSignatureAndBody(node, this.emitFunctionTypeHead?.bind?.(this), this.emitFunctionTypeBody?.bind?.(this));
    }
    public emitFunctionTypeHead(node: FunctionTypeNode | ConstructorTypeNode) {
        this.emitTypeParameters(node, node.typeParameters);
        this.emitParametersForArrow(node, node.parameters);
        this.writeSpace();
        this.writePunctuation("=>");
    }
    public emitFunctionTypeBody(node: FunctionTypeNode | ConstructorTypeNode) {
        this.writeSpace();
        this.emit(node.type);
    }
    public emitJSDocFunctionType(node: JSDocFunctionType) {
        this.writeKeyword("function");
        this.emitParameters(node, node.parameters);
        this.writePunctuation(":");
        this.emit(node.type);
    }
    public emitJSDocNullableType(node: JSDocNullableType) {
        this.writePunctuation("?");
        this.emit(node.type);
    }
    public emitJSDocNonNullableType(node: JSDocNonNullableType) {
        this.writePunctuation("!");
        this.emit(node.type);
    }
    public emitJSDocOptionalType(node: JSDocOptionalType) {
        this.emit(node.type);
        this.writePunctuation("=");
    }
    public emitConstructorType(node: ConstructorTypeNode) {
        this.emitModifierList(node, node.modifiers);
        this.writeKeyword("new");
        this.writeSpace();
        this.emitSignatureAndBody(node, this.emitFunctionTypeHead?.bind?.(this), this.emitFunctionTypeBody?.bind?.(this));
    }
    public emitTypeQuery(node: TypeQueryNode) {
        this.writeKeyword("typeof");
        this.writeSpace();
        this.emit(node.exprName);
        this.emitTypeArguments(node, node.typeArguments);
    }
    public emitTypeLiteral(node: TypeLiteralNode) {
        this.pushNameGenerationScope(node);
        forEach(node.members, this.generateMemberNames?.bind?.(this));
        this.writePunctuation("{");
        const flags = getEmitFlags(node) & EmitFlags.SingleLine ? ListFormat.SingleLineTypeLiteralMembers : ListFormat.MultiLineTypeLiteralMembers;
        this.emitList(node, node.members, flags | ListFormat.NoSpaceIfEmpty);
        this.writePunctuation("}");
        this.popNameGenerationScope(node);
    }
    public emitArrayType(node: ArrayTypeNode) {
        this.emit(node.elementType, this.parenthesizer.parenthesizeNonArrayTypeOfPostfixType);
        this.writePunctuation("[");
        this.writePunctuation("]");
    }
    public emitRestOrJSDocVariadicType(node: RestTypeNode | JSDocVariadicType) {
        this.writePunctuation("...");
        this.emit(node.type);
    }
    public emitTupleType(node: TupleTypeNode) {
        this.emitTokenWithComment(SyntaxKind.OpenBracketToken, node.pos, this.writePunctuation?.bind?.(this), node);
        const flags = getEmitFlags(node) & EmitFlags.SingleLine ? ListFormat.SingleLineTupleTypeElements : ListFormat.MultiLineTupleTypeElements;
        this.emitList(node, node.elements, flags | ListFormat.NoSpaceIfEmpty, this.parenthesizer.parenthesizeElementTypeOfTupleType);
        this.emitTokenWithComment(SyntaxKind.CloseBracketToken, node.elements.end, this.writePunctuation?.bind?.(this), node);
    }
    public emitNamedTupleMember(node: NamedTupleMember) {
        this.emit(node.dotDotDotToken);
        this.emit(node.name);
        this.emit(node.questionToken);
        this.emitTokenWithComment(SyntaxKind.ColonToken, node.name.end, this.writePunctuation?.bind?.(this), node);
        this.writeSpace();
        this.emit(node.type);
    }
    public emitOptionalType(node: OptionalTypeNode) {
        this.emit(node.type, this.parenthesizer.parenthesizeTypeOfOptionalType);
        this.writePunctuation("?");
    }
    public emitUnionType(node: UnionTypeNode) {
        this.emitList(node, node.types, ListFormat.UnionTypeConstituents, this.parenthesizer.parenthesizeConstituentTypeOfUnionType);
    }
    public emitIntersectionType(node: IntersectionTypeNode) {
        this.emitList(node, node.types, ListFormat.IntersectionTypeConstituents, this.parenthesizer.parenthesizeConstituentTypeOfIntersectionType);
    }
    public emitConditionalType(node: ConditionalTypeNode) {
        this.emit(node.checkType, this.parenthesizer.parenthesizeCheckTypeOfConditionalType);
        this.writeSpace();
        this.writeKeyword("extends");
        this.writeSpace();
        this.emit(node.extendsType, this.parenthesizer.parenthesizeExtendsTypeOfConditionalType);
        this.writeSpace();
        this.writePunctuation("?");
        this.writeSpace();
        this.emit(node.trueType);
        this.writeSpace();
        this.writePunctuation(":");
        this.writeSpace();
        this.emit(node.falseType);
    }
    public emitInferType(node: InferTypeNode) {
        this.writeKeyword("infer");
        this.writeSpace();
        this.emit(node.typeParameter);
    }
    public emitParenthesizedType(node: ParenthesizedTypeNode) {
        this.writePunctuation("(");
        this.emit(node.type);
        this.writePunctuation(")");
    }
    public emitThisType() {
        this.writeKeyword("this");
    }
    public emitTypeOperator(node: TypeOperatorNode) {
        this.writeTokenText(node.operator, this.writeKeyword?.bind?.(this));
        this.writeSpace();
        const parenthesizerRule = node.operator === SyntaxKind.ReadonlyKeyword ? this.parenthesizer.parenthesizeOperandOfReadonlyTypeOperator : this.parenthesizer.parenthesizeOperandOfTypeOperator;
        this.emit(node.type, parenthesizerRule);
    }
    public emitIndexedAccessType(node: IndexedAccessTypeNode) {
        this.emit(node.objectType, this.parenthesizer.parenthesizeNonArrayTypeOfPostfixType);
        this.writePunctuation("[");
        this.emit(node.indexType);
        this.writePunctuation("]");
    }
    public emitMappedType(node: MappedTypeNode) {
        const emitFlags = getEmitFlags(node);
        this.writePunctuation("{");
        if (emitFlags & EmitFlags.SingleLine) {
            this.writeSpace();
        }
        else {
            this.writeLine();
            this.increaseIndent();
        }
        if (node.readonlyToken) {
            this.emit(node.readonlyToken);
            if (node.readonlyToken.kind !== SyntaxKind.ReadonlyKeyword) {
                this.writeKeyword("readonly");
            }
            this.writeSpace();
        }
        this.writePunctuation("[");
        this.pipelineEmit(EmitHint.MappedTypeParameter, node.typeParameter);
        if (node.nameType) {
            this.writeSpace();
            this.writeKeyword("as");
            this.writeSpace();
            this.emit(node.nameType);
        }
        this.writePunctuation("]");
        if (node.questionToken) {
            this.emit(node.questionToken);
            if (node.questionToken.kind !== SyntaxKind.QuestionToken) {
                this.writePunctuation("?");
            }
        }
        this.writePunctuation(":");
        this.writeSpace();
        this.emit(node.type);
        this.writeTrailingSemicolon();
        if (emitFlags & EmitFlags.SingleLine) {
            this.writeSpace();
        }
        else {
            this.writeLine();
            this.decreaseIndent();
        }
        this.emitList(node, node.members, ListFormat.PreserveLines);
        this.writePunctuation("}");
    }
    public emitLiteralType(node: LiteralTypeNode) {
        this.emitExpression(node.literal);
    }
    public emitTemplateType(node: TemplateLiteralTypeNode) {
        this.emit(node.head);
        this.emitList(node, node.templateSpans, ListFormat.TemplateExpressionSpans);
    }
    public emitImportTypeNode(node: ImportTypeNode) {
        if (node.isTypeOf) {
            this.writeKeyword("typeof");
            this.writeSpace();
        }
        this.writeKeyword("import");
        this.writePunctuation("(");
        this.emit(node.argument);
        if (node.attributes) {
            this.writePunctuation(",");
            this.writeSpace();
            this.pipelineEmit(EmitHint.ImportTypeNodeAttributes, node.attributes);
        }
        this.writePunctuation(")");
        if (node.qualifier) {
            this.writePunctuation(".");
            this.emit(node.qualifier);
        }
        this.emitTypeArguments(node, node.typeArguments);
    }
    public emitObjectBindingPattern(node: ObjectBindingPattern) {
        this.writePunctuation("{");
        this.emitList(node, node.elements, ListFormat.ObjectBindingPatternElements);
        this.writePunctuation("}");
    }
    public emitArrayBindingPattern(node: ArrayBindingPattern) {
        this.writePunctuation("[");
        this.emitList(node, node.elements, ListFormat.ArrayBindingPatternElements);
        this.writePunctuation("]");
    }
    public emitBindingElement(node: BindingElement) {
        this.emit(node.dotDotDotToken);
        if (node.propertyName) {
            this.emit(node.propertyName);
            this.writePunctuation(":");
            this.writeSpace();
        }
        this.emit(node.name);
        this.emitInitializer(node.initializer, node.name.end, node, this.parenthesizer.parenthesizeExpressionForDisallowedComma);
    }
    public emitArrayLiteralExpression(node: ArrayLiteralExpression) {
        const elements = node.elements;
        const preferNewLine = node.multiLine ? ListFormat.PreferNewLine : ListFormat.None;
        this.emitExpressionList(node, elements, ListFormat.ArrayLiteralExpressionElements | preferNewLine, this.parenthesizer.parenthesizeExpressionForDisallowedComma);
    }
    public emitObjectLiteralExpression(node: ObjectLiteralExpression) {
        this.pushNameGenerationScope(node);
        forEach(node.properties, this.generateMemberNames?.bind?.(this));
        const indentedFlag = getEmitFlags(node) & EmitFlags.Indented;
        if (indentedFlag) {
            this.increaseIndent();
        }
        const preferNewLine = node.multiLine ? ListFormat.PreferNewLine : ListFormat.None;
        const allowTrailingComma = this.currentSourceFile && this.currentSourceFile.languageVersion >= ScriptTarget.ES5 && !isJsonSourceFile(this.currentSourceFile) ? ListFormat.AllowTrailingComma : ListFormat.None;
        this.emitList(node, node.properties, ListFormat.ObjectLiteralExpressionProperties | allowTrailingComma | preferNewLine);
        if (indentedFlag) {
            this.decreaseIndent();
        }
        this.popNameGenerationScope(node);
    }
    public emitPropertyAccessExpression(node: PropertyAccessExpression) {
        this.emitExpression(node.expression, this.parenthesizer.parenthesizeLeftSideOfAccess);
        const token = node.questionDotToken || setTextRangePosEnd((factory.createToken)(SyntaxKind.DotToken) as DotToken, node.expression.end, node.name.pos);
        const linesBeforeDot = this.getLinesBetweenNodes(node, node.expression, token);
        const linesAfterDot = this.getLinesBetweenNodes(node, token, node.name);
        this.writeLinesAndIndent(linesBeforeDot, /*writeSpaceIfNotIndenting*/ false);
        const shouldEmitDotDot = token.kind !== SyntaxKind.QuestionDotToken &&
            this.mayNeedDotDotForPropertyAccess(node.expression) &&
            !(this.writer.hasTrailingComment)() &&
            !(this.writer.hasTrailingWhitespace)();
        if (shouldEmitDotDot) {
            this.writePunctuation(".");
        }
        if (node.questionDotToken) {
            this.emit(token);
        }
        else {
            this.emitTokenWithComment(token.kind, node.expression.end, this.writePunctuation?.bind?.(this), node);
        }
        this.writeLinesAndIndent(linesAfterDot, /*writeSpaceIfNotIndenting*/ false);
        this.emit(node.name);
        this.decreaseIndentIf(linesBeforeDot, linesAfterDot);
    }
    public mayNeedDotDotForPropertyAccess(expression: Expression) {
        expression = skipPartiallyEmittedExpressions(expression);
        if (isNumericLiteral(expression)) {
            // check if numeric literal is a decimal literal that was originally written with a dot
            const text = this.getLiteralTextOfNode(expression as LiteralExpression, /*sourceFile*/ undefined, /*neverAsciiEscape*/ true, /*jsxAttributeEscape*/ false);
            // If the number will be printed verbatim and it doesn't already contain a dot or an exponent indicator, add one
            // if the expression doesn't have any comments that will be emitted.
            return !(expression.numericLiteralFlags & TokenFlags.WithSpecifier)
                && !(text.includes)(tokenToString(SyntaxKind.DotToken))
                && !(text.includes)((String.fromCharCode)(CharacterCodes.E))
                && !(text.includes)((String.fromCharCode)(CharacterCodes.e));
        }
        else if (isAccessExpression(expression)) {
            // check if constant enum value is a non-negative integer
            const constantValue = getConstantValue(expression);
            // isFinite handles cases when constantValue is undefined
            return typeof constantValue === "number" && isFinite(constantValue)
                && constantValue >= 0 && (Math.floor)(constantValue) === constantValue;
        }
    }
    public emitElementAccessExpression(node: ElementAccessExpression) {
        this.emitExpression(node.expression, this.parenthesizer.parenthesizeLeftSideOfAccess);
        this.emit(node.questionDotToken);
        this.emitTokenWithComment(SyntaxKind.OpenBracketToken, node.expression.end, this.writePunctuation?.bind?.(this), node);
        this.emitExpression(node.argumentExpression);
        this.emitTokenWithComment(SyntaxKind.CloseBracketToken, node.argumentExpression.end, this.writePunctuation?.bind?.(this), node);
    }
    public emitCallExpression(node: CallExpression) {
        const indirectCall = getInternalEmitFlags(node) & InternalEmitFlags.IndirectCall;
        if (indirectCall) {
            this.writePunctuation("(");
            this.writeLiteral("0");
            this.writePunctuation(",");
            this.writeSpace();
        }
        this.emitExpression(node.expression, this.parenthesizer.parenthesizeLeftSideOfAccess);
        if (indirectCall) {
            this.writePunctuation(")");
        }
        this.emit(node.questionDotToken);
        this.emitTypeArguments(node, node.typeArguments);
        this.emitExpressionList(node, node.arguments, ListFormat.CallExpressionArguments, this.parenthesizer.parenthesizeExpressionForDisallowedComma);
    }
    public emitNewExpression(node: NewExpression) {
        this.emitTokenWithComment(SyntaxKind.NewKeyword, node.pos, this.writeKeyword?.bind?.(this), node);
        this.writeSpace();
        this.emitExpression(node.expression, this.parenthesizer.parenthesizeExpressionOfNew);
        this.emitTypeArguments(node, node.typeArguments);
        this.emitExpressionList(node, node.arguments, ListFormat.NewExpressionArguments, this.parenthesizer.parenthesizeExpressionForDisallowedComma);
    }
    public emitTaggedTemplateExpression(node: TaggedTemplateExpression) {
        const indirectCall = getInternalEmitFlags(node) & InternalEmitFlags.IndirectCall;
        if (indirectCall) {
            this.writePunctuation("(");
            this.writeLiteral("0");
            this.writePunctuation(",");
            this.writeSpace();
        }
        this.emitExpression(node.tag, this.parenthesizer.parenthesizeLeftSideOfAccess);
        if (indirectCall) {
            this.writePunctuation(")");
        }
        this.emitTypeArguments(node, node.typeArguments);
        this.writeSpace();
        this.emitExpression(node.template);
    }
    public emitTypeAssertionExpression(node: TypeAssertion) {
        this.writePunctuation("<");
        this.emit(node.type);
        this.writePunctuation(">");
        this.emitExpression(node.expression, this.parenthesizer.parenthesizeOperandOfPrefixUnary);
    }
    public emitParenthesizedExpression(node: ParenthesizedExpression) {
        const openParenPos = this.emitTokenWithComment(SyntaxKind.OpenParenToken, node.pos, this.writePunctuation?.bind?.(this), node);
        const indented = this.writeLineSeparatorsAndIndentBefore(node.expression, node);
        this.emitExpression(node.expression, /*parenthesizerRule*/ undefined);
        this.writeLineSeparatorsAfter(node.expression, node);
        this.decreaseIndentIf(indented);
        this.emitTokenWithComment(SyntaxKind.CloseParenToken, node.expression ? node.expression.end : openParenPos, this.writePunctuation?.bind?.(this), node);
    }
    public emitFunctionExpression(node: FunctionExpression) {
        this.generateNameIfNeeded(node.name);
        this.emitFunctionDeclarationOrExpression(node);
    }
    public emitArrowFunction(node: ArrowFunction) {
        this.emitModifierList(node, node.modifiers);
        this.emitSignatureAndBody(node, this.emitArrowFunctionHead?.bind?.(this), this.emitArrowFunctionBody?.bind?.(this));
    }
    public emitArrowFunctionHead(node: ArrowFunction) {
        this.emitTypeParameters(node, node.typeParameters);
        this.emitParametersForArrow(node, node.parameters);
        this.emitTypeAnnotation(node.type);
        this.writeSpace();
        this.emit(node.equalsGreaterThanToken);
    }
    public emitArrowFunctionBody(node: ArrowFunction) {
        if (isBlock(node.body)) {
            this.emitBlockFunctionBody(node.body);
        }
        else {
            this.writeSpace();
            this.emitExpression(node.body, this.parenthesizer.parenthesizeConciseBodyOfArrowFunction);
        }
    }
    public emitDeleteExpression(node: DeleteExpression) {
        this.emitTokenWithComment(SyntaxKind.DeleteKeyword, node.pos, this.writeKeyword?.bind?.(this), node);
        this.writeSpace();
        this.emitExpression(node.expression, this.parenthesizer.parenthesizeOperandOfPrefixUnary);
    }
    public emitTypeOfExpression(node: TypeOfExpression) {
        this.emitTokenWithComment(SyntaxKind.TypeOfKeyword, node.pos, this.writeKeyword?.bind?.(this), node);
        this.writeSpace();
        this.emitExpression(node.expression, this.parenthesizer.parenthesizeOperandOfPrefixUnary);
    }
    public emitVoidExpression(node: VoidExpression) {
        this.emitTokenWithComment(SyntaxKind.VoidKeyword, node.pos, this.writeKeyword?.bind?.(this), node);
        this.writeSpace();
        this.emitExpression(node.expression, this.parenthesizer.parenthesizeOperandOfPrefixUnary);
    }
    public emitAwaitExpression(node: AwaitExpression) {
        this.emitTokenWithComment(SyntaxKind.AwaitKeyword, node.pos, this.writeKeyword?.bind?.(this), node);
        this.writeSpace();
        this.emitExpression(node.expression, this.parenthesizer.parenthesizeOperandOfPrefixUnary);
    }
    public emitPrefixUnaryExpression(node: PrefixUnaryExpression) {
        this.writeTokenText(node.operator, this.writeOperator?.bind?.(this));
        if (this.shouldEmitWhitespaceBeforeOperand(node)) {
            this.writeSpace();
        }
        this.emitExpression(node.operand, this.parenthesizer.parenthesizeOperandOfPrefixUnary);
    }
    public shouldEmitWhitespaceBeforeOperand(node: PrefixUnaryExpression) {
        // In some cases, we need to emit a space between the operator and the operand. One obvious case
        // is when the operator is an identifier, like delete or typeof. We also need to do this for plus
        // and minus expressions in certain cases. Specifically, consider the following two cases (parens
        // are just for clarity of exposition, and not part of the source code):
        //
        //  (+(+1))
        //  (+(++1))
        //
        // We need to emit a space in both cases. In the first case, the absence of a space will make
        // the resulting expression a prefix increment operation. And in the second, it will make the resulting
        // expression a prefix increment whose operand is a plus expression - (++(+x))
        // The same is true of minus of course.
        const operand = node.operand;
        return operand.kind === SyntaxKind.PrefixUnaryExpression
            && ((node.operator === SyntaxKind.PlusToken && ((operand as PrefixUnaryExpression).operator === SyntaxKind.PlusToken || (operand as PrefixUnaryExpression).operator === SyntaxKind.PlusPlusToken))
                || (node.operator === SyntaxKind.MinusToken && ((operand as PrefixUnaryExpression).operator === SyntaxKind.MinusToken || (operand as PrefixUnaryExpression).operator === SyntaxKind.MinusMinusToken)));
    }
    public emitPostfixUnaryExpression(node: PostfixUnaryExpression) {
        this.emitExpression(node.operand, this.parenthesizer.parenthesizeOperandOfPostfixUnary);
        this.writeTokenText(node.operator, this.writeOperator?.bind?.(this));
    }
    public createEmitBinaryExpression() {
        const this_ = this;
        interface WorkArea {
            stackIndex: number;
            preserveSourceNewlinesStack: (boolean | undefined)[];
            containerPosStack: number[];
            containerEndStack: number[];
            declarationListContainerEndStack: number[];
            shouldEmitCommentsStack: boolean[];
            shouldEmitSourceMapsStack: boolean[];
        }
        return createBinaryExpressionTrampoline(onEnter, onLeft, onOperator, onRight, onExit, /*foldState*/ undefined);
        function onEnter(node: BinaryExpression, state: WorkArea | undefined) {
            if (state) {
                state.stackIndex++;
                (state.preserveSourceNewlinesStack)[state.stackIndex] = this_.preserveSourceNewlines;
                (state.containerPosStack)[state.stackIndex] = this_.containerPos;
                (state.containerEndStack)[state.stackIndex] = this_.containerEnd;
                (state.declarationListContainerEndStack)[state.stackIndex] = this_.declarationListContainerEnd;
                const emitComments = (state.shouldEmitCommentsStack)[state.stackIndex] = this_.shouldEmitComments(node);
                const emitSourceMaps = (state.shouldEmitSourceMapsStack)[state.stackIndex] = this_.shouldEmitSourceMaps(node);
                this_.onBeforeEmitNode?.(node);
                if (emitComments)
                    this_.emitCommentsBeforeNode(node);
                if (emitSourceMaps)
                    this_.emitSourceMapsBeforeNode(node);
                this_.beforeEmitNode(node);
            }
            else {
                state = {
                    stackIndex: 0,
                    preserveSourceNewlinesStack: [undefined],
                    containerPosStack: [-1],
                    containerEndStack: [-1],
                    declarationListContainerEndStack: [-1],
                    shouldEmitCommentsStack: [false],
                    shouldEmitSourceMapsStack: [false],
                };
            }
            return state;
        }
        function onLeft(next: Expression, _workArea: WorkArea, parent: BinaryExpression) {
            return maybeEmitExpression(next, parent, "left");
        }
        function onOperator(operatorToken: BinaryOperatorToken, _state: WorkArea, node: BinaryExpression) {
            const isCommaOperator = operatorToken.kind !== SyntaxKind.CommaToken;
            const linesBeforeOperator = this_.getLinesBetweenNodes(node, node.left, operatorToken);
            const linesAfterOperator = this_.getLinesBetweenNodes(node, operatorToken, node.right);
            this_.writeLinesAndIndent(linesBeforeOperator, isCommaOperator);
            this_.emitLeadingCommentsOfPosition(operatorToken.pos);
            this_.writeTokenNode(operatorToken, operatorToken.kind === SyntaxKind.InKeyword ? this_.writeKeyword?.bind?.(this_) : this_.writeOperator?.bind?.(this_));
            this_.emitTrailingCommentsOfPosition(operatorToken.end, /*prefixSpace*/ true); // Binary operators should have a space before the comment starts
            this_.writeLinesAndIndent(linesAfterOperator, /*writeSpaceIfNotIndenting*/ true);
        }
        function onRight(next: Expression, _workArea: WorkArea, parent: BinaryExpression) {
            return maybeEmitExpression(next, parent, "right");
        }
        function onExit(node: BinaryExpression, state: WorkArea) {
            const linesBeforeOperator = this_.getLinesBetweenNodes(node, node.left, node.operatorToken);
            const linesAfterOperator = this_.getLinesBetweenNodes(node, node.operatorToken, node.right);
            this_.decreaseIndentIf(linesBeforeOperator, linesAfterOperator);
            if (state.stackIndex > 0) {
                const savedPreserveSourceNewlines = (state.preserveSourceNewlinesStack)[state.stackIndex];
                const savedContainerPos = (state.containerPosStack)[state.stackIndex];
                const savedContainerEnd = (state.containerEndStack)[state.stackIndex];
                const savedDeclarationListContainerEnd = (state.declarationListContainerEndStack)[state.stackIndex];
                const shouldEmitComments = (state.shouldEmitCommentsStack)[state.stackIndex];
                const shouldEmitSourceMaps = (state.shouldEmitSourceMapsStack)[state.stackIndex];
                this_.afterEmitNode(savedPreserveSourceNewlines);
                if (shouldEmitSourceMaps)
                    this_.emitSourceMapsAfterNode(node);
                if (shouldEmitComments)
                    this_.emitCommentsAfterNode(node, savedContainerPos, savedContainerEnd, savedDeclarationListContainerEnd);
                this_.onAfterEmitNode?.(node);
                state.stackIndex--;
            }
        }
        function maybeEmitExpression(next: Expression, parent: BinaryExpression, side: "left" | "right") {
            const parenthesizerRule = side === "left" ?
                (this_.parenthesizer.getParenthesizeLeftSideOfBinaryForOperator)(parent.operatorToken.kind) :
                (this_.parenthesizer.getParenthesizeRightSideOfBinaryForOperator)(parent.operatorToken.kind);
            let pipelinePhase = this_.getPipelinePhase(PipelinePhase.Notification, EmitHint.Expression, next);
            if (pipelinePhase === this_.pipelineEmitWithSubstitution?.bind?.(this_)) {
                (Debug.assertIsDefined)(this_.lastSubstitution);
                next = parenthesizerRule(cast(this_.lastSubstitution, isExpression));
                pipelinePhase = this_.getNextPipelinePhase(PipelinePhase.Substitution, EmitHint.Expression, next);
                this_.lastSubstitution = undefined;
            }
            if (pipelinePhase === this_.pipelineEmitWithComments?.bind?.(this_) ||
                pipelinePhase === this_.pipelineEmitWithSourceMaps?.bind?.(this_) ||
                pipelinePhase === this_.pipelineEmitWithHint?.bind?.(this_)) {
                if (isBinaryExpression(next)) {
                    return next;
                }
            }
            this_.currentParenthesizerRule = parenthesizerRule;
            pipelinePhase(EmitHint.Expression, next);
        }
    }
    public emitConditionalExpression(node: ConditionalExpression) {
        const linesBeforeQuestion = this.getLinesBetweenNodes(node, node.condition, node.questionToken);
        const linesAfterQuestion = this.getLinesBetweenNodes(node, node.questionToken, node.whenTrue);
        const linesBeforeColon = this.getLinesBetweenNodes(node, node.whenTrue, node.colonToken);
        const linesAfterColon = this.getLinesBetweenNodes(node, node.colonToken, node.whenFalse);
        this.emitExpression(node.condition, this.parenthesizer.parenthesizeConditionOfConditionalExpression);
        this.writeLinesAndIndent(linesBeforeQuestion, /*writeSpaceIfNotIndenting*/ true);
        this.emit(node.questionToken);
        this.writeLinesAndIndent(linesAfterQuestion, /*writeSpaceIfNotIndenting*/ true);
        this.emitExpression(node.whenTrue, this.parenthesizer.parenthesizeBranchOfConditionalExpression);
        this.decreaseIndentIf(linesBeforeQuestion, linesAfterQuestion);
        this.writeLinesAndIndent(linesBeforeColon, /*writeSpaceIfNotIndenting*/ true);
        this.emit(node.colonToken);
        this.writeLinesAndIndent(linesAfterColon, /*writeSpaceIfNotIndenting*/ true);
        this.emitExpression(node.whenFalse, this.parenthesizer.parenthesizeBranchOfConditionalExpression);
        this.decreaseIndentIf(linesBeforeColon, linesAfterColon);
    }
    public emitTemplateExpression(node: TemplateExpression) {
        this.emit(node.head);
        this.emitList(node, node.templateSpans, ListFormat.TemplateExpressionSpans);
    }
    public emitYieldExpression(node: YieldExpression) {
        this.emitTokenWithComment(SyntaxKind.YieldKeyword, node.pos, this.writeKeyword?.bind?.(this), node);
        this.emit(node.asteriskToken);
        this.emitExpressionWithLeadingSpace(node.expression && this.parenthesizeExpressionForNoAsi(node.expression), this.parenthesizeExpressionForNoAsiAndDisallowedComma?.bind?.(this));
    }
    public emitSpreadElement(node: SpreadElement) {
        this.emitTokenWithComment(SyntaxKind.DotDotDotToken, node.pos, this.writePunctuation?.bind?.(this), node);
        this.emitExpression(node.expression, this.parenthesizer.parenthesizeExpressionForDisallowedComma);
    }
    public emitClassExpression(node: ClassExpression) {
        this.generateNameIfNeeded(node.name);
        this.emitClassDeclarationOrExpression(node);
    }
    public emitExpressionWithTypeArguments(node: ExpressionWithTypeArguments) {
        this.emitExpression(node.expression, this.parenthesizer.parenthesizeLeftSideOfAccess);
        this.emitTypeArguments(node, node.typeArguments);
    }
    public emitAsExpression(node: AsExpression) {
        this.emitExpression(node.expression, /*parenthesizerRule*/ undefined);
        if (node.type) {
            this.writeSpace();
            this.writeKeyword("as");
            this.writeSpace();
            this.emit(node.type);
        }
    }
    public emitNonNullExpression(node: NonNullExpression) {
        this.emitExpression(node.expression, this.parenthesizer.parenthesizeLeftSideOfAccess);
        this.writeOperator("!");
    }
    public emitSatisfiesExpression(node: SatisfiesExpression) {
        this.emitExpression(node.expression, /*parenthesizerRule*/ undefined);
        if (node.type) {
            this.writeSpace();
            this.writeKeyword("satisfies");
            this.writeSpace();
            this.emit(node.type);
        }
    }
    public emitMetaProperty(node: MetaProperty) {
        this.writeToken(node.keywordToken, node.pos, this.writePunctuation?.bind?.(this));
        this.writePunctuation(".");
        this.emit(node.name);
    }
    public emitTemplateSpan(node: TemplateSpan) {
        this.emitExpression(node.expression);
        this.emit(node.literal);
    }
    public emitBlock(node: Block) {
        this.emitBlockStatements(node, /*forceSingleLine*/ !node.multiLine && this.isEmptyBlock(node));
    }
    public emitBlockStatements(node: BlockLike, forceSingleLine: boolean) {
        this.emitTokenWithComment(SyntaxKind.OpenBraceToken, node.pos, this.writePunctuation?.bind?.(this), /*contextNode*/ node);
        const format = forceSingleLine || getEmitFlags(node) & EmitFlags.SingleLine ? ListFormat.SingleLineBlockStatements : ListFormat.MultiLineBlockStatements;
        this.emitList(node, node.statements, format);
        this.emitTokenWithComment(SyntaxKind.CloseBraceToken, node.statements.end, this.writePunctuation?.bind?.(this), /*contextNode*/ node, /*indentLeading*/ !!(format & ListFormat.MultiLine));
    }
    public emitVariableStatement(node: VariableStatement) {
        this.emitDecoratorsAndModifiers(node, node.modifiers, /*allowDecorators*/ false);
        this.emit(node.declarationList);
        this.writeTrailingSemicolon();
    }
    public emitEmptyStatement(isEmbeddedStatement: boolean) {
        // While most trailing semicolons are possibly insignificant, an embedded "empty"
        // statement is significant and cannot be elided by a trailing-semicolon-omitting writer.
        if (isEmbeddedStatement) {
            this.writePunctuation(";");
        }
        else {
            this.writeTrailingSemicolon();
        }
    }
    public emitExpressionStatement(node: ExpressionStatement) {
        this.emitExpression(node.expression, this.parenthesizer.parenthesizeExpressionOfExpressionStatement);
        // Emit semicolon in non json files
        // or if json file that created synthesized expression(eg.define expression statement when --out and amd code generation)
        if (!this.currentSourceFile || !isJsonSourceFile(this.currentSourceFile) || nodeIsSynthesized(node.expression)) {
            this.writeTrailingSemicolon();
        }
    }
    public emitIfStatement(node: IfStatement) {
        const openParenPos = this.emitTokenWithComment(SyntaxKind.IfKeyword, node.pos, this.writeKeyword?.bind?.(this), node);
        this.writeSpace();
        this.emitTokenWithComment(SyntaxKind.OpenParenToken, openParenPos, this.writePunctuation?.bind?.(this), node);
        this.emitExpression(node.expression);
        this.emitTokenWithComment(SyntaxKind.CloseParenToken, node.expression.end, this.writePunctuation?.bind?.(this), node);
        this.emitEmbeddedStatement(node, node.thenStatement);
        if (node.elseStatement) {
            this.writeLineOrSpace(node, node.thenStatement, node.elseStatement);
            this.emitTokenWithComment(SyntaxKind.ElseKeyword, node.thenStatement.end, this.writeKeyword?.bind?.(this), node);
            if (node.elseStatement.kind === SyntaxKind.IfStatement) {
                this.writeSpace();
                this.emit(node.elseStatement);
            }
            else {
                this.emitEmbeddedStatement(node, node.elseStatement);
            }
        }
    }
    public emitWhileClause(node: WhileStatement | DoStatement, startPos: number) {
        const openParenPos = this.emitTokenWithComment(SyntaxKind.WhileKeyword, startPos, this.writeKeyword?.bind?.(this), node);
        this.writeSpace();
        this.emitTokenWithComment(SyntaxKind.OpenParenToken, openParenPos, this.writePunctuation?.bind?.(this), node);
        this.emitExpression(node.expression);
        this.emitTokenWithComment(SyntaxKind.CloseParenToken, node.expression.end, this.writePunctuation?.bind?.(this), node);
    }
    public emitDoStatement(node: DoStatement) {
        this.emitTokenWithComment(SyntaxKind.DoKeyword, node.pos, this.writeKeyword?.bind?.(this), node);
        this.emitEmbeddedStatement(node, node.statement);
        if (isBlock(node.statement) && !this.preserveSourceNewlines) {
            this.writeSpace();
        }
        else {
            this.writeLineOrSpace(node, node.statement, node.expression);
        }
        this.emitWhileClause(node, node.statement.end);
        this.writeTrailingSemicolon();
    }
    public emitWhileStatement(node: WhileStatement) {
        this.emitWhileClause(node, node.pos);
        this.emitEmbeddedStatement(node, node.statement);
    }
    public emitForStatement(node: ForStatement) {
        const openParenPos = this.emitTokenWithComment(SyntaxKind.ForKeyword, node.pos, this.writeKeyword?.bind?.(this), node);
        this.writeSpace();
        let pos = this.emitTokenWithComment(SyntaxKind.OpenParenToken, openParenPos, this.writePunctuation?.bind?.(this), /*contextNode*/ node);
        this.emitForBinding(node.initializer);
        pos = this.emitTokenWithComment(SyntaxKind.SemicolonToken, node.initializer ? node.initializer.end : pos, this.writePunctuation?.bind?.(this), node);
        this.emitExpressionWithLeadingSpace(node.condition);
        pos = this.emitTokenWithComment(SyntaxKind.SemicolonToken, node.condition ? node.condition.end : pos, this.writePunctuation?.bind?.(this), node);
        this.emitExpressionWithLeadingSpace(node.incrementor);
        this.emitTokenWithComment(SyntaxKind.CloseParenToken, node.incrementor ? node.incrementor.end : pos, this.writePunctuation?.bind?.(this), node);
        this.emitEmbeddedStatement(node, node.statement);
    }
    public emitForInStatement(node: ForInStatement) {
        const openParenPos = this.emitTokenWithComment(SyntaxKind.ForKeyword, node.pos, this.writeKeyword?.bind?.(this), node);
        this.writeSpace();
        this.emitTokenWithComment(SyntaxKind.OpenParenToken, openParenPos, this.writePunctuation?.bind?.(this), node);
        this.emitForBinding(node.initializer);
        this.writeSpace();
        this.emitTokenWithComment(SyntaxKind.InKeyword, node.initializer.end, this.writeKeyword?.bind?.(this), node);
        this.writeSpace();
        this.emitExpression(node.expression);
        this.emitTokenWithComment(SyntaxKind.CloseParenToken, node.expression.end, this.writePunctuation?.bind?.(this), node);
        this.emitEmbeddedStatement(node, node.statement);
    }
    public emitForOfStatement(node: ForOfStatement) {
        const openParenPos = this.emitTokenWithComment(SyntaxKind.ForKeyword, node.pos, this.writeKeyword?.bind?.(this), node);
        this.writeSpace();
        this.emitWithTrailingSpace(node.awaitModifier);
        this.emitTokenWithComment(SyntaxKind.OpenParenToken, openParenPos, this.writePunctuation?.bind?.(this), node);
        this.emitForBinding(node.initializer);
        this.writeSpace();
        this.emitTokenWithComment(SyntaxKind.OfKeyword, node.initializer.end, this.writeKeyword?.bind?.(this), node);
        this.writeSpace();
        this.emitExpression(node.expression);
        this.emitTokenWithComment(SyntaxKind.CloseParenToken, node.expression.end, this.writePunctuation?.bind?.(this), node);
        this.emitEmbeddedStatement(node, node.statement);
    }
    public emitForBinding(node: VariableDeclarationList | Expression | undefined) {
        if (node !== undefined) {
            if (node.kind === SyntaxKind.VariableDeclarationList) {
                this.emit(node);
            }
            else {
                this.emitExpression(node);
            }
        }
    }
    public emitContinueStatement(node: ContinueStatement) {
        this.emitTokenWithComment(SyntaxKind.ContinueKeyword, node.pos, this.writeKeyword?.bind?.(this), node);
        this.emitWithLeadingSpace(node.label);
        this.writeTrailingSemicolon();
    }
    public emitBreakStatement(node: BreakStatement) {
        this.emitTokenWithComment(SyntaxKind.BreakKeyword, node.pos, this.writeKeyword?.bind?.(this), node);
        this.emitWithLeadingSpace(node.label);
        this.writeTrailingSemicolon();
    }
    public emitTokenWithComment(token: SyntaxKind, pos: number, writer: (s: string) => void, contextNode: Node, indentLeading?: boolean) {
        const node = getParseTreeNode(contextNode);
        const isSimilarNode = node && node.kind === contextNode.kind;
        const startPos = pos;
        if (isSimilarNode && this.currentSourceFile) {
            pos = skipTrivia(this.currentSourceFile.text, pos);
        }
        if (isSimilarNode && contextNode.pos !== startPos) {
            const needsIndent = indentLeading && this.currentSourceFile && !positionsAreOnSameLine(startPos, pos, this.currentSourceFile);
            if (needsIndent) {
                this.increaseIndent();
            }
            this.emitLeadingCommentsOfPosition(startPos);
            if (needsIndent) {
                this.decreaseIndent();
            }
        }
        // We don't emit source positions for most tokens as it tends to be quite noisy, however
        // we need to emit source positions for open and close braces so that tools like istanbul
        // can map branches for code coverage. However, we still omit brace source positions when
        // the output is a declaration file.
        if (!this.omitBraceSourcePositions && (token === SyntaxKind.OpenBraceToken || token === SyntaxKind.CloseBraceToken)) {
            pos = this.writeToken(token, pos, writer, contextNode);
        }
        else {
            pos = this.writeTokenText(token, writer, pos);
        }
        if (isSimilarNode && contextNode.end !== pos) {
            const isJsxExprContext = contextNode.kind === SyntaxKind.JsxExpression;
            this.emitTrailingCommentsOfPosition(pos, /*prefixSpace*/ !isJsxExprContext, /*forceNoNewline*/ isJsxExprContext);
        }
        return pos;
    }
    public commentWillEmitNewLine(node: CommentRange) {
        return node.kind === SyntaxKind.SingleLineCommentTrivia || !!node.hasTrailingNewLine;
    }
    public willEmitLeadingNewLine(node: Expression): boolean {
        if (!this.currentSourceFile)
            return false;
        const leadingCommentRanges = getLeadingCommentRanges(this.currentSourceFile.text, node.pos);
        if (leadingCommentRanges) {
            const parseNode = getParseTreeNode(node);
            if (parseNode && isParenthesizedExpression(parseNode.parent)) {
                return true;
            }
        }
        if (some(leadingCommentRanges, this.commentWillEmitNewLine?.bind?.(this)))
            return true;
        if (some(getSyntheticLeadingComments(node), this.commentWillEmitNewLine?.bind?.(this)))
            return true;
        if (isPartiallyEmittedExpression(node)) {
            if (node.pos !== node.expression.pos) {
                if (some(getTrailingCommentRanges(this.currentSourceFile.text, node.expression.pos), this.commentWillEmitNewLine?.bind?.(this)))
                    return true;
            }
            return this.willEmitLeadingNewLine(node.expression);
        }
        return false;
    }
    public parenthesizeExpressionForNoAsi(node: Expression): Expression {
        if (!this.commentsDisabled) {
            switch (node.kind) {
                case SyntaxKind.PartiallyEmittedExpression:
                    if (this.willEmitLeadingNewLine(node)) {
                        const parseNode = getParseTreeNode(node);
                        if (parseNode && isParenthesizedExpression(parseNode)) {
                            // If the original node was a parenthesized expression, restore it to preserve comment and source map emit
                            const parens = (factory.createParenthesizedExpression)((node as PartiallyEmittedExpression).expression);
                            setOriginalNode(parens, node);
                            setTextRange(parens, parseNode);
                            return parens;
                        }
                        return (factory.createParenthesizedExpression)(node);
                    }
                    return (factory.updatePartiallyEmittedExpression)(node as PartiallyEmittedExpression, this.parenthesizeExpressionForNoAsi((node as PartiallyEmittedExpression).expression));
                case SyntaxKind.PropertyAccessExpression:
                    return (factory.updatePropertyAccessExpression)(node as PropertyAccessExpression, this.parenthesizeExpressionForNoAsi((node as PropertyAccessExpression).expression), (node as PropertyAccessExpression).name);
                case SyntaxKind.ElementAccessExpression:
                    return (factory.updateElementAccessExpression)(node as ElementAccessExpression, this.parenthesizeExpressionForNoAsi((node as ElementAccessExpression).expression), (node as ElementAccessExpression).argumentExpression);
                case SyntaxKind.CallExpression:
                    return (factory.updateCallExpression)(node as CallExpression, this.parenthesizeExpressionForNoAsi((node as CallExpression).expression), (node as CallExpression).typeArguments, (node as CallExpression).arguments);
                case SyntaxKind.TaggedTemplateExpression:
                    return (factory.updateTaggedTemplateExpression)(node as TaggedTemplateExpression, this.parenthesizeExpressionForNoAsi((node as TaggedTemplateExpression).tag), (node as TaggedTemplateExpression).typeArguments, (node as TaggedTemplateExpression).template);
                case SyntaxKind.PostfixUnaryExpression:
                    return (factory.updatePostfixUnaryExpression)(node as PostfixUnaryExpression, this.parenthesizeExpressionForNoAsi((node as PostfixUnaryExpression).operand));
                case SyntaxKind.BinaryExpression:
                    return (factory.updateBinaryExpression)(node as BinaryExpression, this.parenthesizeExpressionForNoAsi((node as BinaryExpression).left), (node as BinaryExpression).operatorToken, (node as BinaryExpression).right);
                case SyntaxKind.ConditionalExpression:
                    return (factory.updateConditionalExpression)(node as ConditionalExpression, this.parenthesizeExpressionForNoAsi((node as ConditionalExpression).condition), (node as ConditionalExpression).questionToken, (node as ConditionalExpression).whenTrue, (node as ConditionalExpression).colonToken, (node as ConditionalExpression).whenFalse);
                case SyntaxKind.AsExpression:
                    return (factory.updateAsExpression)(node as AsExpression, this.parenthesizeExpressionForNoAsi((node as AsExpression).expression), (node as AsExpression).type);
                case SyntaxKind.SatisfiesExpression:
                    return (factory.updateSatisfiesExpression)(node as SatisfiesExpression, this.parenthesizeExpressionForNoAsi((node as SatisfiesExpression).expression), (node as SatisfiesExpression).type);
                case SyntaxKind.NonNullExpression:
                    return (factory.updateNonNullExpression)(node as NonNullExpression, this.parenthesizeExpressionForNoAsi((node as NonNullExpression).expression));
            }
        }
        return node;
    }
    public parenthesizeExpressionForNoAsiAndDisallowedComma(node: Expression) {
        return this.parenthesizeExpressionForNoAsi((this.parenthesizer.parenthesizeExpressionForDisallowedComma)(node));
    }
    public emitReturnStatement(node: ReturnStatement) {
        this.emitTokenWithComment(SyntaxKind.ReturnKeyword, node.pos, this.writeKeyword?.bind?.(this), /*contextNode*/ node);
        this.emitExpressionWithLeadingSpace(node.expression && this.parenthesizeExpressionForNoAsi(node.expression), this.parenthesizeExpressionForNoAsi?.bind?.(this));
        this.writeTrailingSemicolon();
    }
    public emitWithStatement(node: WithStatement) {
        const openParenPos = this.emitTokenWithComment(SyntaxKind.WithKeyword, node.pos, this.writeKeyword?.bind?.(this), node);
        this.writeSpace();
        this.emitTokenWithComment(SyntaxKind.OpenParenToken, openParenPos, this.writePunctuation?.bind?.(this), node);
        this.emitExpression(node.expression);
        this.emitTokenWithComment(SyntaxKind.CloseParenToken, node.expression.end, this.writePunctuation?.bind?.(this), node);
        this.emitEmbeddedStatement(node, node.statement);
    }
    public emitSwitchStatement(node: SwitchStatement) {
        const openParenPos = this.emitTokenWithComment(SyntaxKind.SwitchKeyword, node.pos, this.writeKeyword?.bind?.(this), node);
        this.writeSpace();
        this.emitTokenWithComment(SyntaxKind.OpenParenToken, openParenPos, this.writePunctuation?.bind?.(this), node);
        this.emitExpression(node.expression);
        this.emitTokenWithComment(SyntaxKind.CloseParenToken, node.expression.end, this.writePunctuation?.bind?.(this), node);
        this.writeSpace();
        this.emit(node.caseBlock);
    }
    public emitLabeledStatement(node: LabeledStatement) {
        this.emit(node.label);
        this.emitTokenWithComment(SyntaxKind.ColonToken, node.label.end, this.writePunctuation?.bind?.(this), node);
        this.writeSpace();
        this.emit(node.statement);
    }
    public emitThrowStatement(node: ThrowStatement) {
        this.emitTokenWithComment(SyntaxKind.ThrowKeyword, node.pos, this.writeKeyword?.bind?.(this), node);
        this.emitExpressionWithLeadingSpace(this.parenthesizeExpressionForNoAsi(node.expression), this.parenthesizeExpressionForNoAsi?.bind?.(this));
        this.writeTrailingSemicolon();
    }
    public emitTryStatement(node: TryStatement) {
        this.emitTokenWithComment(SyntaxKind.TryKeyword, node.pos, this.writeKeyword?.bind?.(this), node);
        this.writeSpace();
        this.emit(node.tryBlock);
        if (node.catchClause) {
            this.writeLineOrSpace(node, node.tryBlock, node.catchClause);
            this.emit(node.catchClause);
        }
        if (node.finallyBlock) {
            this.writeLineOrSpace(node, node.catchClause || node.tryBlock, node.finallyBlock);
            this.emitTokenWithComment(SyntaxKind.FinallyKeyword, (node.catchClause || node.tryBlock).end, this.writeKeyword?.bind?.(this), node);
            this.writeSpace();
            this.emit(node.finallyBlock);
        }
    }
    public emitDebuggerStatement(node: DebuggerStatement) {
        this.writeToken(SyntaxKind.DebuggerKeyword, node.pos, this.writeKeyword?.bind?.(this));
        this.writeTrailingSemicolon();
    }
    public emitVariableDeclaration(node: VariableDeclaration) {
        this.emit(node.name);
        this.emit(node.exclamationToken);
        this.emitTypeAnnotation(node.type);
        this.emitInitializer(node.initializer, node.type?.end ?? node.name.emitNode?.typeNode?.end ?? node.name.end, node, this.parenthesizer.parenthesizeExpressionForDisallowedComma);
    }
    public emitVariableDeclarationList(node: VariableDeclarationList) {
        if (isVarAwaitUsing(node)) {
            this.writeKeyword("await");
            this.writeSpace();
            this.writeKeyword("using");
        }
        else {
            const head = isLet(node) ? "let" :
                isVarConst(node) ? "const" :
                    isVarUsing(node) ? "using" :
                        "var";
            this.writeKeyword(head);
        }
        this.writeSpace();
        this.emitList(node, node.declarations, ListFormat.VariableDeclarationList);
    }
    public emitFunctionDeclaration(node: FunctionDeclaration) {
        this.emitFunctionDeclarationOrExpression(node);
    }
    public emitFunctionDeclarationOrExpression(node: FunctionDeclaration | FunctionExpression) {
        this.emitDecoratorsAndModifiers(node, node.modifiers, /*allowDecorators*/ false);
        this.writeKeyword("function");
        this.emit(node.asteriskToken);
        this.writeSpace();
        this.emitIdentifierName(node.name);
        this.emitSignatureAndBody(node, this.emitSignatureHead?.bind?.(this), this.emitFunctionBody?.bind?.(this));
    }
    public emitSignatureAndBody<T extends SignatureDeclaration>(node: T, emitSignatureHead: (node: T) => void, emitBody: (node: T) => void) {
        const indentedFlag = getEmitFlags(node) & EmitFlags.Indented;
        if (indentedFlag) {
            this.increaseIndent();
        }
        this.pushNameGenerationScope(node);
        forEach(node.parameters, this.generateNames?.bind?.(this));
        emitSignatureHead(node);
        emitBody(node);
        this.popNameGenerationScope(node);
        if (indentedFlag) {
            this.decreaseIndent();
        }
    }
    public emitFunctionBody<T extends Exclude<FunctionLikeDeclaration, ArrowFunction>>(node: T) {
        const body = node.body;
        if (body) {
            this.emitBlockFunctionBody(body);
        }
        else {
            this.writeTrailingSemicolon();
        }
    }
    public emitEmptyFunctionBody(_node: SignatureDeclaration) {
        this.writeTrailingSemicolon();
    }
    public emitSignatureHead(node: SignatureDeclaration) {
        this.emitTypeParameters(node, node.typeParameters);
        this.emitParameters(node, node.parameters);
        this.emitTypeAnnotation(node.type);
    }
    public shouldEmitBlockFunctionBodyOnSingleLine(body: Block) {
        // We must emit a function body as a single-line body in the following case:
        // * The body has NodeEmitFlags.SingleLine specified.
        // We must emit a function body as a multi-line body in the following cases:
        // * The body is explicitly marked as multi-line.
        // * A non-synthesized body's start and end position are on different lines.
        // * Any statement in the body starts on a new line.
        if (getEmitFlags(body) & EmitFlags.SingleLine) {
            return true;
        }
        if (body.multiLine) {
            return false;
        }
        if (!nodeIsSynthesized(body) && this.currentSourceFile && !rangeIsOnSingleLine(body, this.currentSourceFile)) {
            return false;
        }
        if (this.getLeadingLineTerminatorCount(body, firstOrUndefined(body.statements), ListFormat.PreserveLines)
            || this.getClosingLineTerminatorCount(body, lastOrUndefined(body.statements), ListFormat.PreserveLines, body.statements)) {
            return false;
        }
        let previousStatement: Statement | undefined;
        for (const statement of body.statements) {
            if (this.getSeparatingLineTerminatorCount(previousStatement, statement, ListFormat.PreserveLines) > 0) {
                return false;
            }
            previousStatement = statement;
        }
        return true;
    }
    public emitBlockFunctionBody(body: Block) {
        this.generateNames(body);
        this.onBeforeEmitNode?.(body);
        this.writeSpace();
        this.writePunctuation("{");
        this.increaseIndent();
        const emitBlockFunctionBody = this.shouldEmitBlockFunctionBodyOnSingleLine(body)
            ? this.emitBlockFunctionBodyOnSingleLine?.bind?.(this) : this.emitBlockFunctionBodyWorker?.bind?.(this);
        this.emitBodyWithDetachedComments(body, body.statements, emitBlockFunctionBody);
        this.decreaseIndent();
        this.writeToken(SyntaxKind.CloseBraceToken, body.statements.end, this.writePunctuation?.bind?.(this), body);
        this.onAfterEmitNode?.(body);
    }
    public emitBlockFunctionBodyOnSingleLine(body: Block) {
        this.emitBlockFunctionBodyWorker(body, /*emitBlockFunctionBodyOnSingleLine*/ true);
    }
    public emitBlockFunctionBodyWorker(body: Block, emitBlockFunctionBodyOnSingleLine?: boolean) {
        // Emit all the prologue directives (like "use strict").
        const statementOffset = this.emitPrologueDirectives(body.statements);
        const pos = (this.writer.getTextPos)();
        this.emitHelpers(body);
        if (statementOffset === 0 && pos === (this.writer.getTextPos)() && emitBlockFunctionBodyOnSingleLine) {
            this.decreaseIndent();
            this.emitList(body, body.statements, ListFormat.SingleLineFunctionBodyStatements);
            this.increaseIndent();
        }
        else {
            this.emitList(body, body.statements, ListFormat.MultiLineFunctionBodyStatements, /*parenthesizerRule*/ undefined, statementOffset);
        }
    }
    public emitClassDeclaration(node: ClassDeclaration) {
        this.emitClassDeclarationOrExpression(node);
    }
    public emitClassDeclarationOrExpression(node: ClassDeclaration | ClassExpression) {
        this.emitDecoratorsAndModifiers(node, node.modifiers, /*allowDecorators*/ true);
        this.emitTokenWithComment(SyntaxKind.ClassKeyword, moveRangePastModifiers(node).pos, this.writeKeyword?.bind?.(this), node);
        if (node.name) {
            this.writeSpace();
            this.emitIdentifierName(node.name);
        }
        const indentedFlag = getEmitFlags(node) & EmitFlags.Indented;
        if (indentedFlag) {
            this.increaseIndent();
        }
        this.emitTypeParameters(node, node.typeParameters);
        this.emitList(node, node.heritageClauses, ListFormat.ClassHeritageClauses);
        this.writeSpace();
        this.writePunctuation("{");
        this.pushNameGenerationScope(node);
        forEach(node.members, this.generateMemberNames?.bind?.(this));
        this.emitList(node, node.members, ListFormat.ClassMembers);
        this.popNameGenerationScope(node);
        this.writePunctuation("}");
        if (indentedFlag) {
            this.decreaseIndent();
        }
    }
    public emitInterfaceDeclaration(node: InterfaceDeclaration) {
        this.emitDecoratorsAndModifiers(node, node.modifiers, /*allowDecorators*/ false);
        this.writeKeyword("interface");
        this.writeSpace();
        this.emit(node.name);
        this.emitTypeParameters(node, node.typeParameters);
        this.emitList(node, node.heritageClauses, ListFormat.HeritageClauses);
        this.writeSpace();
        this.writePunctuation("{");
        this.pushNameGenerationScope(node);
        forEach(node.members, this.generateMemberNames?.bind?.(this));
        this.emitList(node, node.members, ListFormat.InterfaceMembers);
        this.popNameGenerationScope(node);
        this.writePunctuation("}");
    }
    public emitTypeAliasDeclaration(node: TypeAliasDeclaration) {
        this.emitDecoratorsAndModifiers(node, node.modifiers, /*allowDecorators*/ false);
        this.writeKeyword("type");
        this.writeSpace();
        this.emit(node.name);
        this.emitTypeParameters(node, node.typeParameters);
        this.writeSpace();
        this.writePunctuation("=");
        this.writeSpace();
        this.emit(node.type);
        this.writeTrailingSemicolon();
    }
    public emitEnumDeclaration(node: EnumDeclaration) {
        this.emitDecoratorsAndModifiers(node, node.modifiers, /*allowDecorators*/ false);
        this.writeKeyword("enum");
        this.writeSpace();
        this.emit(node.name);
        this.writeSpace();
        this.writePunctuation("{");
        this.emitList(node, node.members, ListFormat.EnumMembers);
        this.writePunctuation("}");
    }
    public emitModuleDeclaration(node: ModuleDeclaration) {
        this.emitDecoratorsAndModifiers(node, node.modifiers, /*allowDecorators*/ false);
        if (~node.flags & NodeFlags.GlobalAugmentation) {
            this.writeKeyword(node.flags & NodeFlags.Namespace ? "namespace" : "module");
            this.writeSpace();
        }
        this.emit(node.name);
        let body = node.body;
        if (!body)
            return this.writeTrailingSemicolon();
        while (body && isModuleDeclaration(body)) {
            this.writePunctuation(".");
            this.emit(body.name);
            body = body.body;
        }
        this.writeSpace();
        this.emit(body);
    }
    public emitModuleBlock(node: ModuleBlock) {
        this.pushNameGenerationScope(node);
        forEach(node.statements, this.generateNames?.bind?.(this));
        this.emitBlockStatements(node, /*forceSingleLine*/ this.isEmptyBlock(node));
        this.popNameGenerationScope(node);
    }
    public emitCaseBlock(node: CaseBlock) {
        this.emitTokenWithComment(SyntaxKind.OpenBraceToken, node.pos, this.writePunctuation?.bind?.(this), node);
        this.emitList(node, node.clauses, ListFormat.CaseBlockClauses);
        this.emitTokenWithComment(SyntaxKind.CloseBraceToken, node.clauses.end, this.writePunctuation?.bind?.(this), node, /*indentLeading*/ true);
    }
    public emitImportEqualsDeclaration(node: ImportEqualsDeclaration) {
        this.emitDecoratorsAndModifiers(node, node.modifiers, /*allowDecorators*/ false);
        this.emitTokenWithComment(SyntaxKind.ImportKeyword, node.modifiers ? node.modifiers.end : node.pos, this.writeKeyword?.bind?.(this), node);
        this.writeSpace();
        if (node.isTypeOnly) {
            this.emitTokenWithComment(SyntaxKind.TypeKeyword, node.pos, this.writeKeyword?.bind?.(this), node);
            this.writeSpace();
        }
        this.emit(node.name);
        this.writeSpace();
        this.emitTokenWithComment(SyntaxKind.EqualsToken, node.name.end, this.writePunctuation?.bind?.(this), node);
        this.writeSpace();
        this.emitModuleReference(node.moduleReference);
        this.writeTrailingSemicolon();
    }
    public emitModuleReference(node: ModuleReference) {
        if (node.kind === SyntaxKind.Identifier) {
            this.emitExpression(node);
        }
        else {
            this.emit(node);
        }
    }
    public emitImportDeclaration(node: ImportDeclaration) {
        this.emitDecoratorsAndModifiers(node, node.modifiers, /*allowDecorators*/ false);
        this.emitTokenWithComment(SyntaxKind.ImportKeyword, node.modifiers ? node.modifiers.end : node.pos, this.writeKeyword?.bind?.(this), node);
        this.writeSpace();
        if (node.importClause) {
            this.emit(node.importClause);
            this.writeSpace();
            this.emitTokenWithComment(SyntaxKind.FromKeyword, node.importClause.end, this.writeKeyword?.bind?.(this), node);
            this.writeSpace();
        }
        this.emitExpression(node.moduleSpecifier);
        if (node.attributes) {
            this.emitWithLeadingSpace(node.attributes);
        }
        this.writeTrailingSemicolon();
    }
    public emitImportClause(node: ImportClause) {
        if (node.phaseModifier !== undefined) {
            this.emitTokenWithComment(node.phaseModifier, node.pos, this.writeKeyword?.bind?.(this), node);
            this.writeSpace();
        }
        this.emit(node.name);
        if (node.name && node.namedBindings) {
            this.emitTokenWithComment(SyntaxKind.CommaToken, node.name.end, this.writePunctuation?.bind?.(this), node);
            this.writeSpace();
        }
        this.emit(node.namedBindings);
    }
    public emitNamespaceImport(node: NamespaceImport) {
        const asPos = this.emitTokenWithComment(SyntaxKind.AsteriskToken, node.pos, this.writePunctuation?.bind?.(this), node);
        this.writeSpace();
        this.emitTokenWithComment(SyntaxKind.AsKeyword, asPos, this.writeKeyword?.bind?.(this), node);
        this.writeSpace();
        this.emit(node.name);
    }
    public emitNamedImports(node: NamedImports) {
        this.emitNamedImportsOrExports(node);
    }
    public emitImportSpecifier(node: ImportSpecifier) {
        this.emitImportOrExportSpecifier(node);
    }
    public emitExportAssignment(node: ExportAssignment) {
        const nextPos = this.emitTokenWithComment(SyntaxKind.ExportKeyword, node.pos, this.writeKeyword?.bind?.(this), node);
        this.writeSpace();
        if (node.isExportEquals) {
            this.emitTokenWithComment(SyntaxKind.EqualsToken, nextPos, this.writeOperator?.bind?.(this), node);
        }
        else {
            this.emitTokenWithComment(SyntaxKind.DefaultKeyword, nextPos, this.writeKeyword?.bind?.(this), node);
        }
        this.writeSpace();
        this.emitExpression(node.expression, node.isExportEquals ?
            (this.parenthesizer.getParenthesizeRightSideOfBinaryForOperator)(SyntaxKind.EqualsToken) : this.parenthesizer.parenthesizeExpressionOfExportDefault);
        this.writeTrailingSemicolon();
    }
    public emitExportDeclaration(node: ExportDeclaration) {
        this.emitDecoratorsAndModifiers(node, node.modifiers, /*allowDecorators*/ false);
        let nextPos = this.emitTokenWithComment(SyntaxKind.ExportKeyword, node.pos, this.writeKeyword?.bind?.(this), node);
        this.writeSpace();
        if (node.isTypeOnly) {
            nextPos = this.emitTokenWithComment(SyntaxKind.TypeKeyword, nextPos, this.writeKeyword?.bind?.(this), node);
            this.writeSpace();
        }
        if (node.exportClause) {
            this.emit(node.exportClause);
        }
        else {
            nextPos = this.emitTokenWithComment(SyntaxKind.AsteriskToken, nextPos, this.writePunctuation?.bind?.(this), node);
        }
        if (node.moduleSpecifier) {
            this.writeSpace();
            const fromPos = node.exportClause ? node.exportClause.end : nextPos;
            this.emitTokenWithComment(SyntaxKind.FromKeyword, fromPos, this.writeKeyword?.bind?.(this), node);
            this.writeSpace();
            this.emitExpression(node.moduleSpecifier);
        }
        if (node.attributes) {
            this.emitWithLeadingSpace(node.attributes);
        }
        this.writeTrailingSemicolon();
    }
    public emitImportTypeNodeAttributes(node: ImportAttributes) {
        this.writePunctuation("{");
        this.writeSpace();
        this.writeKeyword(node.token === SyntaxKind.AssertKeyword ? "assert" : "with");
        this.writePunctuation(":");
        this.writeSpace();
        const elements = node.elements;
        this.emitList(node, elements, ListFormat.ImportAttributes);
        this.writeSpace();
        this.writePunctuation("}");
    }
    public emitImportAttributes(node: ImportAttributes) {
        this.emitTokenWithComment(node.token, node.pos, this.writeKeyword?.bind?.(this), node);
        this.writeSpace();
        const elements = node.elements;
        this.emitList(node, elements, ListFormat.ImportAttributes);
    }
    public emitImportAttribute(node: ImportAttribute) {
        this.emit(node.name);
        this.writePunctuation(":");
        this.writeSpace();
        const value = node.value;
        /** @see {emitPropertyAssignment} */
        if ((getEmitFlags(value) & EmitFlags.NoLeadingComments) === 0) {
            const commentRange = getCommentRange(value);
            this.emitTrailingCommentsOfPosition(commentRange.pos);
        }
        this.emit(value);
    }
    public emitNamespaceExportDeclaration(node: NamespaceExportDeclaration) {
        let nextPos = this.emitTokenWithComment(SyntaxKind.ExportKeyword, node.pos, this.writeKeyword?.bind?.(this), node);
        this.writeSpace();
        nextPos = this.emitTokenWithComment(SyntaxKind.AsKeyword, nextPos, this.writeKeyword?.bind?.(this), node);
        this.writeSpace();
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        nextPos = this.emitTokenWithComment(SyntaxKind.NamespaceKeyword, nextPos, this.writeKeyword?.bind?.(this), node);
        this.writeSpace();
        this.emit(node.name);
        this.writeTrailingSemicolon();
    }
    public emitNamespaceExport(node: NamespaceExport) {
        const asPos = this.emitTokenWithComment(SyntaxKind.AsteriskToken, node.pos, this.writePunctuation?.bind?.(this), node);
        this.writeSpace();
        this.emitTokenWithComment(SyntaxKind.AsKeyword, asPos, this.writeKeyword?.bind?.(this), node);
        this.writeSpace();
        this.emit(node.name);
    }
    public emitNamedExports(node: NamedExports) {
        this.emitNamedImportsOrExports(node);
    }
    public emitExportSpecifier(node: ExportSpecifier) {
        this.emitImportOrExportSpecifier(node);
    }
    public emitNamedImportsOrExports(node: NamedImportsOrExports) {
        this.writePunctuation("{");
        this.emitList(node, node.elements, ListFormat.NamedImportsOrExportsElements);
        this.writePunctuation("}");
    }
    public emitImportOrExportSpecifier(node: ImportOrExportSpecifier) {
        if (node.isTypeOnly) {
            this.writeKeyword("type");
            this.writeSpace();
        }
        if (node.propertyName) {
            this.emit(node.propertyName);
            this.writeSpace();
            this.emitTokenWithComment(SyntaxKind.AsKeyword, node.propertyName.end, this.writeKeyword?.bind?.(this), node);
            this.writeSpace();
        }
        this.emit(node.name);
    }
    public emitExternalModuleReference(node: ExternalModuleReference) {
        this.writeKeyword("require");
        this.writePunctuation("(");
        this.emitExpression(node.expression);
        this.writePunctuation(")");
    }
    public emitJsxElement(node: JsxElement) {
        this.emit(node.openingElement);
        this.emitList(node, node.children, ListFormat.JsxElementOrFragmentChildren);
        this.emit(node.closingElement);
    }
    public emitJsxSelfClosingElement(node: JsxSelfClosingElement) {
        this.writePunctuation("<");
        this.emitJsxTagName(node.tagName);
        this.emitTypeArguments(node, node.typeArguments);
        this.writeSpace();
        this.emit(node.attributes);
        this.writePunctuation("/>");
    }
    public emitJsxFragment(node: JsxFragment) {
        this.emit(node.openingFragment);
        this.emitList(node, node.children, ListFormat.JsxElementOrFragmentChildren);
        this.emit(node.closingFragment);
    }
    public emitJsxOpeningElementOrFragment(node: JsxOpeningElement | JsxOpeningFragment) {
        this.writePunctuation("<");
        if (isJsxOpeningElement(node)) {
            const indented = this.writeLineSeparatorsAndIndentBefore(node.tagName, node);
            this.emitJsxTagName(node.tagName);
            this.emitTypeArguments(node, node.typeArguments);
            if (node.attributes.properties && node.attributes.properties.length > 0) {
                this.writeSpace();
            }
            this.emit(node.attributes);
            this.writeLineSeparatorsAfter(node.attributes, node);
            this.decreaseIndentIf(indented);
        }
        this.writePunctuation(">");
    }
    public emitJsxText(node: JsxText) {
        (this.writer.writeLiteral)(node.text);
    }
    public emitJsxClosingElementOrFragment(node: JsxClosingElement | JsxClosingFragment) {
        this.writePunctuation("</");
        if (isJsxClosingElement(node)) {
            this.emitJsxTagName(node.tagName);
        }
        this.writePunctuation(">");
    }
    public emitJsxAttributes(node: JsxAttributes) {
        this.emitList(node, node.properties, ListFormat.JsxElementAttributes);
    }
    public emitJsxAttribute(node: JsxAttribute) {
        this.emit(node.name);
        this.emitNodeWithPrefix("=", this.writePunctuation?.bind?.(this), node.initializer, this.emitJsxAttributeValue?.bind?.(this));
    }
    public emitJsxSpreadAttribute(node: JsxSpreadAttribute) {
        this.writePunctuation("{...");
        this.emitExpression(node.expression);
        this.writePunctuation("}");
    }
    public hasTrailingCommentsAtPosition(pos: number) {
        let result = false;
        forEachTrailingCommentRange(this.currentSourceFile?.text || "", pos + 1, () => result = true);
        return result;
    }
    public hasLeadingCommentsAtPosition(pos: number) {
        let result = false;
        forEachLeadingCommentRange(this.currentSourceFile?.text || "", pos + 1, () => result = true);
        return result;
    }
    public hasCommentsAtPosition(pos: number) {
        return this.hasTrailingCommentsAtPosition(pos) || this.hasLeadingCommentsAtPosition(pos);
    }
    public emitJsxExpression(node: JsxExpression) {
        if (node.expression || (!this.commentsDisabled && !nodeIsSynthesized(node) && this.hasCommentsAtPosition(node.pos))) { // preserve empty expressions if they contain comments!
            const isMultiline = this.currentSourceFile && !nodeIsSynthesized(node) && getLineAndCharacterOfPosition(this.currentSourceFile, node.pos).line !== getLineAndCharacterOfPosition(this.currentSourceFile, node.end).line;
            if (isMultiline) {
                (this.writer.increaseIndent)();
            }
            const end = this.emitTokenWithComment(SyntaxKind.OpenBraceToken, node.pos, this.writePunctuation?.bind?.(this), node);
            this.emit(node.dotDotDotToken);
            this.emitExpression(node.expression);
            this.emitTokenWithComment(SyntaxKind.CloseBraceToken, node.expression?.end || end, this.writePunctuation?.bind?.(this), node);
            if (isMultiline) {
                (this.writer.decreaseIndent)();
            }
        }
    }
    public emitJsxNamespacedName(node: JsxNamespacedName) {
        this.emitIdentifierName(node.namespace);
        this.writePunctuation(":");
        this.emitIdentifierName(node.name);
    }
    public emitJsxTagName(node: JsxTagNameExpression) {
        if (node.kind === SyntaxKind.Identifier) {
            this.emitExpression(node);
        }
        else {
            this.emit(node);
        }
    }
    public emitCaseClause(node: CaseClause) {
        this.emitTokenWithComment(SyntaxKind.CaseKeyword, node.pos, this.writeKeyword?.bind?.(this), node);
        this.writeSpace();
        this.emitExpression(node.expression, this.parenthesizer.parenthesizeExpressionForDisallowedComma);
        this.emitCaseOrDefaultClauseRest(node, node.statements, node.expression.end);
    }
    public emitDefaultClause(node: DefaultClause) {
        const pos = this.emitTokenWithComment(SyntaxKind.DefaultKeyword, node.pos, this.writeKeyword?.bind?.(this), node);
        this.emitCaseOrDefaultClauseRest(node, node.statements, pos);
    }
    public emitCaseOrDefaultClauseRest(parentNode: Node, statements: NodeArray<Statement>, colonPos: number) {
        const emitAsSingleStatement = statements.length === 1 &&
            (
            // treat synthesized nodes as located on the same line for emit purposes
            !this.currentSourceFile ||
                nodeIsSynthesized(parentNode) ||
                nodeIsSynthesized(statements[0]) ||
                rangeStartPositionsAreOnSameLine(parentNode, statements[0], this.currentSourceFile));
        let format = ListFormat.CaseOrDefaultClauseStatements;
        if (emitAsSingleStatement) {
            this.writeToken(SyntaxKind.ColonToken, colonPos, this.writePunctuation?.bind?.(this), parentNode);
            this.writeSpace();
            format &= ~(ListFormat.MultiLine | ListFormat.Indented);
        }
        else {
            this.emitTokenWithComment(SyntaxKind.ColonToken, colonPos, this.writePunctuation?.bind?.(this), parentNode);
        }
        this.emitList(parentNode, statements, format);
    }
    public emitHeritageClause(node: HeritageClause) {
        this.writeSpace();
        this.writeTokenText(node.token, this.writeKeyword?.bind?.(this));
        this.writeSpace();
        this.emitList(node, node.types, ListFormat.HeritageClauseTypes);
    }
    public emitCatchClause(node: CatchClause) {
        const openParenPos = this.emitTokenWithComment(SyntaxKind.CatchKeyword, node.pos, this.writeKeyword?.bind?.(this), node);
        this.writeSpace();
        if (node.variableDeclaration) {
            this.emitTokenWithComment(SyntaxKind.OpenParenToken, openParenPos, this.writePunctuation?.bind?.(this), node);
            this.emit(node.variableDeclaration);
            this.emitTokenWithComment(SyntaxKind.CloseParenToken, node.variableDeclaration.end, this.writePunctuation?.bind?.(this), node);
            this.writeSpace();
        }
        this.emit(node.block);
    }
    public emitPropertyAssignment(node: PropertyAssignment) {
        this.emit(node.name);
        this.writePunctuation(":");
        this.writeSpace();
        // This is to ensure that we emit comment in the following case:
        //      For example:
        //          obj = {
        //              id: /*comment1*/ ()=>void
        //          }
        // "comment1" is not considered to be leading comment for node.initializer
        // but rather a trailing comment on the previous node.
        const initializer = node.initializer;
        if ((getEmitFlags(initializer) & EmitFlags.NoLeadingComments) === 0) {
            const commentRange = getCommentRange(initializer);
            this.emitTrailingCommentsOfPosition(commentRange.pos);
        }
        this.emitExpression(initializer, this.parenthesizer.parenthesizeExpressionForDisallowedComma);
    }
    public emitShorthandPropertyAssignment(node: ShorthandPropertyAssignment) {
        this.emit(node.name);
        if (node.objectAssignmentInitializer) {
            this.writeSpace();
            this.writePunctuation("=");
            this.writeSpace();
            this.emitExpression(node.objectAssignmentInitializer, this.parenthesizer.parenthesizeExpressionForDisallowedComma);
        }
    }
    public emitSpreadAssignment(node: SpreadAssignment) {
        if (node.expression) {
            this.emitTokenWithComment(SyntaxKind.DotDotDotToken, node.pos, this.writePunctuation?.bind?.(this), node);
            this.emitExpression(node.expression, this.parenthesizer.parenthesizeExpressionForDisallowedComma);
        }
    }
    public emitEnumMember(node: EnumMember) {
        this.emit(node.name);
        this.emitInitializer(node.initializer, node.name.end, node, this.parenthesizer.parenthesizeExpressionForDisallowedComma);
    }
    public emitJSDoc(node: JSDoc) {
        this.write("/**");
        if (node.comment) {
            const text = getTextOfJSDocComment(node.comment);
            if (text) {
                const lines = (text.split)(/\r\n?|\n/);
                for (const line of lines) {
                    this.writeLine();
                    this.writeSpace();
                    this.writePunctuation("*");
                    this.writeSpace();
                    this.write(line);
                }
            }
        }
        if (node.tags) {
            if (node.tags.length === 1 && (node.tags)[0].kind === SyntaxKind.JSDocTypeTag && !node.comment) {
                this.writeSpace();
                this.emit((node.tags)[0]);
            }
            else {
                this.emitList(node, node.tags, ListFormat.JSDocComment);
            }
        }
        this.writeSpace();
        this.write("*/");
    }
    public emitJSDocSimpleTypedTag(tag: JSDocTypeTag | JSDocThisTag | JSDocEnumTag | JSDocReturnTag | JSDocThrowsTag | JSDocSatisfiesTag) {
        this.emitJSDocTagName(tag.tagName);
        this.emitJSDocTypeExpression(tag.typeExpression);
        this.emitJSDocComment(tag.comment);
    }
    public emitJSDocSeeTag(tag: JSDocSeeTag) {
        this.emitJSDocTagName(tag.tagName);
        this.emit(tag.name);
        this.emitJSDocComment(tag.comment);
    }
    public emitJSDocImportTag(tag: JSDocImportTag) {
        this.emitJSDocTagName(tag.tagName);
        this.writeSpace();
        if (tag.importClause) {
            this.emit(tag.importClause);
            this.writeSpace();
            this.emitTokenWithComment(SyntaxKind.FromKeyword, tag.importClause.end, this.writeKeyword?.bind?.(this), tag);
            this.writeSpace();
        }
        this.emitExpression(tag.moduleSpecifier);
        if (tag.attributes) {
            this.emitWithLeadingSpace(tag.attributes);
        }
        this.emitJSDocComment(tag.comment);
    }
    public emitJSDocNameReference(node: JSDocNameReference) {
        this.writeSpace();
        this.writePunctuation("{");
        this.emit(node.name);
        this.writePunctuation("}");
    }
    public emitJSDocHeritageTag(tag: JSDocImplementsTag | JSDocAugmentsTag) {
        this.emitJSDocTagName(tag.tagName);
        this.writeSpace();
        this.writePunctuation("{");
        this.emit(tag.class);
        this.writePunctuation("}");
        this.emitJSDocComment(tag.comment);
    }
    public emitJSDocTemplateTag(tag: JSDocTemplateTag) {
        this.emitJSDocTagName(tag.tagName);
        this.emitJSDocTypeExpression(tag.constraint);
        this.writeSpace();
        this.emitList(tag, tag.typeParameters, ListFormat.CommaListElements);
        this.emitJSDocComment(tag.comment);
    }
    public emitJSDocTypedefTag(tag: JSDocTypedefTag) {
        this.emitJSDocTagName(tag.tagName);
        if (tag.typeExpression) {
            if (tag.typeExpression.kind === SyntaxKind.JSDocTypeExpression) {
                this.emitJSDocTypeExpression(tag.typeExpression);
            }
            else {
                this.writeSpace();
                this.writePunctuation("{");
                this.write("Object");
                if (tag.typeExpression.isArrayType) {
                    this.writePunctuation("[");
                    this.writePunctuation("]");
                }
                this.writePunctuation("}");
            }
        }
        if (tag.fullName) {
            this.writeSpace();
            this.emit(tag.fullName);
        }
        this.emitJSDocComment(tag.comment);
        if (tag.typeExpression && tag.typeExpression.kind === SyntaxKind.JSDocTypeLiteral) {
            this.emitJSDocTypeLiteral(tag.typeExpression);
        }
    }
    public emitJSDocCallbackTag(tag: JSDocCallbackTag) {
        this.emitJSDocTagName(tag.tagName);
        if (tag.name) {
            this.writeSpace();
            this.emit(tag.name);
        }
        this.emitJSDocComment(tag.comment);
        this.emitJSDocSignature(tag.typeExpression);
    }
    public emitJSDocOverloadTag(tag: JSDocOverloadTag) {
        this.emitJSDocComment(tag.comment);
        this.emitJSDocSignature(tag.typeExpression);
    }
    public emitJSDocSimpleTag(tag: JSDocTag) {
        this.emitJSDocTagName(tag.tagName);
        this.emitJSDocComment(tag.comment);
    }
    public emitJSDocTypeLiteral(lit: JSDocTypeLiteral) {
        this.emitList(lit, (factory.createNodeArray)(lit.jsDocPropertyTags), ListFormat.JSDocComment);
    }
    public emitJSDocSignature(sig: JSDocSignature) {
        if (sig.typeParameters) {
            this.emitList(sig, (factory.createNodeArray)(sig.typeParameters), ListFormat.JSDocComment);
        }
        if (sig.parameters) {
            this.emitList(sig, (factory.createNodeArray)(sig.parameters), ListFormat.JSDocComment);
        }
        if (sig.type) {
            this.writeLine();
            this.writeSpace();
            this.writePunctuation("*");
            this.writeSpace();
            this.emit(sig.type);
        }
    }
    public emitJSDocPropertyLikeTag(param: JSDocPropertyLikeTag) {
        this.emitJSDocTagName(param.tagName);
        this.emitJSDocTypeExpression(param.typeExpression);
        this.writeSpace();
        if (param.isBracketed) {
            this.writePunctuation("[");
        }
        this.emit(param.name);
        if (param.isBracketed) {
            this.writePunctuation("]");
        }
        this.emitJSDocComment(param.comment);
    }
    public emitJSDocTagName(tagName: Identifier) {
        this.writePunctuation("@");
        this.emit(tagName);
    }
    public emitJSDocComment(comment: string | NodeArray<JSDocComment> | undefined) {
        const text = getTextOfJSDocComment(comment);
        if (text) {
            this.writeSpace();
            this.write(text);
        }
    }
    public emitJSDocTypeExpression(typeExpression: JSDocTypeExpression | undefined) {
        if (typeExpression) {
            this.writeSpace();
            this.writePunctuation("{");
            this.emit(typeExpression.type);
            this.writePunctuation("}");
        }
    }
    public emitSourceFile(node: SourceFile) {
        this.writeLine();
        const statements = node.statements;
        // Emit detached comment if there are no prologue directives or if the first node is synthesized.
        // The synthesized node will have no leading comment so some comments may be missed.
        const shouldEmitDetachedComment = statements.length === 0 ||
            !isPrologueDirective(statements[0]) ||
            nodeIsSynthesized(statements[0]);
        if (shouldEmitDetachedComment) {
            this.emitBodyWithDetachedComments(node, statements, this.emitSourceFileWorker?.bind?.(this));
            return;
        }
        this.emitSourceFileWorker(node);
    }
    public emitSyntheticTripleSlashReferencesIfNeeded(node: Bundle) {
        this.emitTripleSlashDirectives(!!node.hasNoDefaultLib, node.syntheticFileReferences || [], node.syntheticTypeReferences || [], node.syntheticLibReferences || []);
    }
    public emitTripleSlashDirectivesIfNeeded(node: SourceFile) {
        if (node.isDeclarationFile)
            this.emitTripleSlashDirectives(node.hasNoDefaultLib, node.referencedFiles, node.typeReferenceDirectives, node.libReferenceDirectives);
    }
    public emitTripleSlashDirectives(hasNoDefaultLib: boolean, files: readonly FileReference[], types: readonly FileReference[], libs: readonly FileReference[]) {
        const this_ = this;
        if (hasNoDefaultLib) {
            this.writeComment(`/// <reference no-default-lib="true"/>`);
            this.writeLine();
        }
        if (this.currentSourceFile && this.currentSourceFile.moduleName) {
            this.writeComment(`/// <amd-module name="${this.currentSourceFile.moduleName}" />`);
            this.writeLine();
        }
        if (this.currentSourceFile && this.currentSourceFile.amdDependencies) {
            for (const dep of this.currentSourceFile.amdDependencies) {
                if (dep.name) {
                    this.writeComment(`/// <amd-dependency name="${dep.name}" path="${dep.path}" />`);
                }
                else {
                    this.writeComment(`/// <amd-dependency path="${dep.path}" />`);
                }
                this.writeLine();
            }
        }
        function writeDirectives(kind: "path" | "types" | "lib", directives: readonly FileReference[]) {
            for (const directive of directives) {
                const resolutionMode = directive.resolutionMode ? `resolution-mode="${directive.resolutionMode === ModuleKind.ESNext ? "import" : "require"}" `
                    : "";
                const preserve = directive.preserve ? `preserve="true" ` : "";
                this_.writeComment(`/// <reference ${kind}="${directive.fileName}" ${resolutionMode}${preserve}/>`);
                this_.writeLine();
            }
        }
        writeDirectives("path", files);
        writeDirectives("types", types);
        writeDirectives("lib", libs);
    }
    public emitSourceFileWorker(node: SourceFile) {
        const statements = node.statements;
        this.pushNameGenerationScope(node);
        forEach(node.statements, this.generateNames?.bind?.(this));
        this.emitHelpers(node);
        const index = findIndex(statements, statement => !isPrologueDirective(statement));
        this.emitTripleSlashDirectivesIfNeeded(node);
        this.emitList(node, statements, ListFormat.MultiLine, /*parenthesizerRule*/ undefined, index === -1 ? statements.length : index);
        this.popNameGenerationScope(node);
    }
    public emitPartiallyEmittedExpression(node: PartiallyEmittedExpression) {
        const emitFlags = getEmitFlags(node);
        if (!(emitFlags & EmitFlags.NoLeadingComments) && node.pos !== node.expression.pos) {
            this.emitTrailingCommentsOfPosition(node.expression.pos);
        }
        this.emitExpression(node.expression);
        if (!(emitFlags & EmitFlags.NoTrailingComments) && node.end !== node.expression.end) {
            this.emitLeadingCommentsOfPosition(node.expression.end);
        }
    }
    public emitCommaList(node: CommaListExpression) {
        this.emitExpressionList(node, node.elements, ListFormat.CommaListElements, /*parenthesizerRule*/ undefined);
    }
    public emitPrologueDirectives(statements: readonly Node[], sourceFile?: SourceFile, seenPrologueDirectives?: Set<string>): number {
        let needsToSetSourceFile = !!sourceFile;
        for (let i = 0; i < statements.length; i++) {
            const statement = statements[i];
            if (isPrologueDirective(statement)) {
                const shouldEmitPrologueDirective = seenPrologueDirectives ? !(seenPrologueDirectives.has)(statement.expression.text) : true;
                if (shouldEmitPrologueDirective) {
                    if (needsToSetSourceFile) {
                        needsToSetSourceFile = false;
                        this.setSourceFile(sourceFile);
                    }
                    this.writeLine();
                    this.emit(statement);
                    if (seenPrologueDirectives) {
                        (seenPrologueDirectives.add)(statement.expression.text);
                    }
                }
            }
            else {
                // return index of the first non prologue directive
                return i;
            }
        }
        return statements.length;
    }
    public emitPrologueDirectivesIfNeeded(sourceFileOrBundle: Bundle | SourceFile) {
        if (isSourceFile(sourceFileOrBundle)) {
            this.emitPrologueDirectives(sourceFileOrBundle.statements, sourceFileOrBundle);
        }
        else {
            const seenPrologueDirectives = new Set<string>();
            for (const sourceFile of sourceFileOrBundle.sourceFiles) {
                this.emitPrologueDirectives(sourceFile.statements, sourceFile, seenPrologueDirectives);
            }
            this.setSourceFile(undefined);
        }
    }
    public emitShebangIfNeeded(sourceFileOrBundle: Bundle | SourceFile) {
        if (isSourceFile(sourceFileOrBundle)) {
            const shebang = getShebang(sourceFileOrBundle.text);
            if (shebang) {
                this.writeComment(shebang);
                this.writeLine();
                return true;
            }
        }
        else {
            for (const sourceFile of sourceFileOrBundle.sourceFiles) {
                // Emit only the first encountered shebang
                if (this.emitShebangIfNeeded(sourceFile)) {
                    return true;
                }
            }
        }
    }
    public emitNodeWithWriter(node: Node | undefined, writer: typeof this.write) {
        if (!node)
            return;
        const savedWrite = this.write;
        this.write = writer;
        this.emit(node);
        this.write = savedWrite;
    }
    public emitDecoratorsAndModifiers(node: Node, modifiers: NodeArray<ModifierLike> | undefined, allowDecorators: boolean) {
        if (modifiers?.length) {
            if (every(modifiers, isModifier)) {
                // if all modifier-likes are `Modifier`, simply emit the array as modifiers.
                return this.emitModifierList(node, modifiers as NodeArray<Modifier>);
            }
            if (every(modifiers, isDecorator)) {
                if (allowDecorators) {
                    // if all modifier-likes are `Decorator`, simply emit the array as decorators.
                    return this.emitDecoratorList(node, modifiers as NodeArray<Decorator>);
                }
                return node.pos;
            }
            this.onBeforeEmitNodeArray?.(modifiers);
            // partition modifiers into contiguous chunks of `Modifier` or `Decorator`
            let lastMode: "modifiers" | "decorators" | undefined;
            let mode: "modifiers" | "decorators" | undefined;
            let start = 0;
            let pos = 0;
            let lastModifier: ModifierLike | undefined;
            while (start < modifiers.length) {
                while (pos < modifiers.length) {
                    lastModifier = modifiers[pos];
                    mode = isDecorator(lastModifier) ? "decorators" : "modifiers";
                    if (lastMode === undefined) {
                        lastMode = mode;
                    }
                    else if (mode !== lastMode) {
                        break;
                    }
                    pos++;
                }
                const textRange: TextRange = { pos: -1, end: -1 };
                if (start === 0)
                    textRange.pos = modifiers.pos;
                if (pos === modifiers.length - 1)
                    textRange.end = modifiers.end;
                if (lastMode === "modifiers" || allowDecorators) {
                    this.emitNodeListItems(this.emit?.bind?.(this), node, modifiers, lastMode === "modifiers" ? ListFormat.Modifiers : ListFormat.Decorators, 
                    /*parenthesizerRule*/ undefined, start, pos - start, 
                    /*hasTrailingComma*/ false, textRange);
                }
                start = pos;
                lastMode = mode;
                pos++;
            }
            this.onAfterEmitNodeArray?.(modifiers);
            if (lastModifier && !positionIsSynthesized(lastModifier.end)) {
                return lastModifier.end;
            }
        }
        return node.pos;
    }
    public emitModifierList(node: Node, modifiers: NodeArray<Modifier> | undefined): number {
        this.emitList(node, modifiers, ListFormat.Modifiers);
        const lastModifier = lastOrUndefined(modifiers);
        return lastModifier && !positionIsSynthesized(lastModifier.end) ? lastModifier.end : node.pos;
    }
    public emitTypeAnnotation(node: TypeNode | undefined) {
        if (node) {
            this.writePunctuation(":");
            this.writeSpace();
            this.emit(node);
        }
    }
    public emitInitializer(node: Expression | undefined, equalCommentStartPos: number, container: Node, parenthesizerRule?: (node: Expression) => Expression) {
        if (node) {
            this.writeSpace();
            this.emitTokenWithComment(SyntaxKind.EqualsToken, equalCommentStartPos, this.writeOperator?.bind?.(this), container);
            this.writeSpace();
            this.emitExpression(node, parenthesizerRule);
        }
    }
    public emitNodeWithPrefix<T extends Node>(prefix: string, prefixWriter: (s: string) => void, node: T | undefined, emit: (node: T) => void) {
        if (node) {
            prefixWriter(prefix);
            emit(node);
        }
    }
    public emitWithLeadingSpace(node: Node | undefined) {
        if (node) {
            this.writeSpace();
            this.emit(node);
        }
    }
    public emitExpressionWithLeadingSpace(node: Expression | undefined, parenthesizerRule?: (node: Expression) => Expression) {
        if (node) {
            this.writeSpace();
            this.emitExpression(node, parenthesizerRule);
        }
    }
    public emitWithTrailingSpace(node: Node | undefined) {
        if (node) {
            this.emit(node);
            this.writeSpace();
        }
    }
    public emitEmbeddedStatement(parent: Node, node: Statement) {
        if (isBlock(node) ||
            getEmitFlags(parent) & EmitFlags.SingleLine ||
            this.preserveSourceNewlines && !this.getLeadingLineTerminatorCount(parent, node, ListFormat.None)) {
            this.writeSpace();
            this.emit(node);
        }
        else {
            this.writeLine();
            this.increaseIndent();
            if (isEmptyStatement(node)) {
                this.pipelineEmit(EmitHint.EmbeddedStatement, node);
            }
            else {
                this.emit(node);
            }
            this.decreaseIndent();
        }
    }
    public emitDecoratorList(parentNode: Node, decorators: NodeArray<Decorator> | undefined): number {
        this.emitList(parentNode, decorators, ListFormat.Decorators);
        const lastDecorator = lastOrUndefined(decorators);
        return lastDecorator && !positionIsSynthesized(lastDecorator.end) ? lastDecorator.end : parentNode.pos;
    }
    public emitTypeArguments(parentNode: Node, typeArguments: NodeArray<TypeNode> | undefined) {
        this.emitList(parentNode, typeArguments, ListFormat.TypeArguments, this.typeArgumentParenthesizerRuleSelector);
    }
    public emitTypeParameters(parentNode: SignatureDeclaration | InterfaceDeclaration | TypeAliasDeclaration | ClassDeclaration | ClassExpression, typeParameters: NodeArray<TypeParameterDeclaration> | undefined) {
        if (isFunctionLike(parentNode) && parentNode.typeArguments) { // Quick info uses type arguments in place of type parameters on instantiated signatures
            return this.emitTypeArguments(parentNode, parentNode.typeArguments);
        }
        this.emitList(parentNode, typeParameters, ListFormat.TypeParameters | (isArrowFunction(parentNode) ? ListFormat.AllowTrailingComma : ListFormat.None));
    }
    public emitParameters(parentNode: Node, parameters: NodeArray<ParameterDeclaration>) {
        this.emitList(parentNode, parameters, ListFormat.Parameters);
    }
    public canEmitSimpleArrowHead(parentNode: FunctionTypeNode | ConstructorTypeNode | ArrowFunction, parameters: NodeArray<ParameterDeclaration>) {
        const parameter = singleOrUndefined(parameters);
        return parameter
            && parameter.pos === parentNode.pos // may not have parsed tokens between parent and parameter
            && isArrowFunction(parentNode) // only arrow functions may have simple arrow head
            && !parentNode.type // arrow function may not have return type annotation
            && !some(parentNode.modifiers) // parent may not have decorators or modifiers
            && !some(parentNode.typeParameters) // parent may not have type parameters
            && !some(parameter.modifiers) // parameter may not have decorators or modifiers
            && !parameter.dotDotDotToken // parameter may not be rest
            && !parameter.questionToken // parameter may not be optional
            && !parameter.type // parameter may not have a type annotation
            && !parameter.initializer // parameter may not have an initializer
            && isIdentifier(parameter.name); // parameter name must be identifier
    }
    public emitParametersForArrow(parentNode: FunctionTypeNode | ConstructorTypeNode | ArrowFunction, parameters: NodeArray<ParameterDeclaration>) {
        if (this.canEmitSimpleArrowHead(parentNode, parameters)) {
            this.emitList(parentNode, parameters, ListFormat.Parameters & ~ListFormat.Parenthesis);
        }
        else {
            this.emitParameters(parentNode, parameters);
        }
    }
    public emitParametersForIndexSignature(parentNode: Node, parameters: NodeArray<ParameterDeclaration>) {
        this.emitList(parentNode, parameters, ListFormat.IndexSignatureParameters);
    }
    public writeDelimiter(format: ListFormat) {
        switch (format & ListFormat.DelimitersMask) {
            case ListFormat.None:
                break;
            case ListFormat.CommaDelimited:
                this.writePunctuation(",");
                break;
            case ListFormat.BarDelimited:
                this.writeSpace();
                this.writePunctuation("|");
                break;
            case ListFormat.AsteriskDelimited:
                this.writeSpace();
                this.writePunctuation("*");
                this.writeSpace();
                break;
            case ListFormat.AmpersandDelimited:
                this.writeSpace();
                this.writePunctuation("&");
                break;
        }
    }
    public emitList<Child extends Node, Children extends NodeArray<Child>>(parentNode: Node | undefined, children: Children | undefined, format: ListFormat, parenthesizerRule?: ParenthesizerRuleOrSelector<Child>, start?: number, count?: number) {
        this.emitNodeList(this.emit?.bind?.(this), parentNode, children, format | (parentNode && getEmitFlags(parentNode) & EmitFlags.MultiLine ? ListFormat.PreferNewLine : 0), parenthesizerRule, start, count);
    }
    public emitExpressionList<Child extends Node, Children extends NodeArray<Child>>(parentNode: Node | undefined, children: Children | undefined, format: ListFormat, parenthesizerRule?: ParenthesizerRuleOrSelector<Child>, start?: number, count?: number) {
        this.emitNodeList(this.emitExpression?.bind?.(this), parentNode, children, format, parenthesizerRule, start, count);
    }
    public emitNodeList<Child extends Node, Children extends NodeArray<Child>>(emit: EmitFunction, parentNode: Node | undefined, children: Children | undefined, format: ListFormat, parenthesizerRule: ParenthesizerRuleOrSelector<Child> | undefined, start = 0, count = children ? children.length - start : 0) {
        const isUndefined = children === undefined;
        if (isUndefined && format & ListFormat.OptionalIfUndefined) {
            return;
        }
        const isEmpty = children === undefined || start >= children.length || count === 0;
        if (isEmpty && format & ListFormat.OptionalIfEmpty) {
            this.onBeforeEmitNodeArray?.(children);
            this.onAfterEmitNodeArray?.(children);
            return;
        }
        if (format & ListFormat.BracketsMask) {
            this.writePunctuation(getOpeningBracket(format));
            if (isEmpty && children) {
                this.emitTrailingCommentsOfPosition(children.pos, /*prefixSpace*/ true); // Emit comments within empty bracketed lists
            }
        }
        this.onBeforeEmitNodeArray?.(children);
        if (isEmpty) {
            // Write a line terminator if the parent node was multi-line
            if (format & ListFormat.MultiLine && !(this.preserveSourceNewlines && (!parentNode || this.currentSourceFile && rangeIsOnSingleLine(parentNode, this.currentSourceFile)))) {
                this.writeLine();
            }
            else if (format & ListFormat.SpaceBetweenBraces && !(format & ListFormat.NoSpaceIfEmpty)) {
                this.writeSpace();
            }
        }
        else {
            this.emitNodeListItems(this.emit?.bind?.(this), parentNode, children, format, parenthesizerRule, start, count, children.hasTrailingComma, children);
        }
        this.onAfterEmitNodeArray?.(children);
        if (format & ListFormat.BracketsMask) {
            if (isEmpty && children) {
                this.emitLeadingCommentsOfPosition(children.end); // Emit leading comments within empty lists
            }
            this.writePunctuation(getClosingBracket(format));
        }
    }
    public emitNodeListItems<Child extends Node>(emit: EmitFunction, parentNode: Node | undefined, children: readonly Child[], format: ListFormat, parenthesizerRule: ParenthesizerRuleOrSelector<Child> | undefined, start: number, count: number, hasTrailingComma: boolean, childrenTextRange: TextRange | undefined) {
        // Write the opening line terminator or leading whitespace.
        const mayEmitInterveningComments = (format & ListFormat.NoInterveningComments) === 0;
        let shouldEmitInterveningComments = mayEmitInterveningComments;
        const leadingLineTerminatorCount = this.getLeadingLineTerminatorCount(parentNode, children[start], format);
        if (leadingLineTerminatorCount) {
            this.writeLine(leadingLineTerminatorCount);
            shouldEmitInterveningComments = false;
        }
        else if (format & ListFormat.SpaceBetweenBraces) {
            this.writeSpace();
        }
        // Increase the indent, if requested.
        if (format & ListFormat.Indented) {
            this.increaseIndent();
        }
        const emitListItem = getEmitListItem(this.emit?.bind?.(this), parenthesizerRule);
        // Emit each child.
        let previousSibling: Node | undefined;
        let shouldDecreaseIndentAfterEmit = false;
        for (let i = 0; i < count; i++) {
            const child = children[start + i];
            // Write the delimiter if this is not the first node.
            if (format & ListFormat.AsteriskDelimited) {
                // always write JSDoc in the format "\n *"
                this.writeLine();
                this.writeDelimiter(format);
            }
            else if (previousSibling) {
                // i.e
                //      function commentedParameters(
                //          /* Parameter a */
                //          a
                //          /* End of parameter a */ -> this comment isn't considered to be trailing comment of parameter "a" due to newline
                //          ,
                if (format & ListFormat.DelimitersMask && previousSibling.end !== (parentNode ? parentNode.end : -1)) {
                    const previousSiblingEmitFlags = getEmitFlags(previousSibling);
                    if (!(previousSiblingEmitFlags & EmitFlags.NoTrailingComments)) {
                        this.emitLeadingCommentsOfPosition(previousSibling.end);
                    }
                }
                this.writeDelimiter(format);
                // Write either a line terminator or whitespace to separate the elements.
                const separatingLineTerminatorCount = this.getSeparatingLineTerminatorCount(previousSibling, child, format);
                if (separatingLineTerminatorCount > 0) {
                    // If a synthesized node in a single-line list starts on a new
                    // line, we should increase the indent.
                    if ((format & (ListFormat.LinesMask | ListFormat.Indented)) === ListFormat.SingleLine) {
                        this.increaseIndent();
                        shouldDecreaseIndentAfterEmit = true;
                    }
                    if (shouldEmitInterveningComments && format & ListFormat.DelimitersMask && !positionIsSynthesized(child.pos)) {
                        const commentRange = getCommentRange(child);
                        this.emitTrailingCommentsOfPosition(commentRange.pos, /*prefixSpace*/ !!(format & ListFormat.SpaceBetweenSiblings), /*forceNoNewline*/ true);
                    }
                    this.writeLine(separatingLineTerminatorCount);
                    shouldEmitInterveningComments = false;
                }
                else if (previousSibling && format & ListFormat.SpaceBetweenSiblings) {
                    this.writeSpace();
                }
            }
            // Emit this child.
            if (shouldEmitInterveningComments) {
                const commentRange = getCommentRange(child);
                this.emitTrailingCommentsOfPosition(commentRange.pos);
            }
            else {
                shouldEmitInterveningComments = mayEmitInterveningComments;
            }
            this.nextListElementPos = child.pos;
            emitListItem(child, this.emit?.bind?.(this), parenthesizerRule, i);
            if (shouldDecreaseIndentAfterEmit) {
                this.decreaseIndent();
                shouldDecreaseIndentAfterEmit = false;
            }
            previousSibling = child;
        }
        // Write a trailing comma, if requested.
        const emitFlags = previousSibling ? getEmitFlags(previousSibling) : 0;
        const skipTrailingComments = this.commentsDisabled || !!(emitFlags & EmitFlags.NoTrailingComments);
        const emitTrailingComma = hasTrailingComma && (format & ListFormat.AllowTrailingComma) && (format & ListFormat.CommaDelimited);
        if (emitTrailingComma) {
            if (previousSibling && !skipTrailingComments) {
                this.emitTokenWithComment(SyntaxKind.CommaToken, previousSibling.end, this.writePunctuation?.bind?.(this), previousSibling);
            }
            else {
                this.writePunctuation(",");
            }
        }
        // Emit any trailing comment of the last element in the list
        // i.e
        //       var array = [...
        //          2
        //          /* end of element 2 */
        //       ];
        if (previousSibling && (parentNode ? parentNode.end : -1) !== previousSibling.end && (format & ListFormat.DelimitersMask) && !skipTrailingComments) {
            this.emitLeadingCommentsOfPosition(emitTrailingComma && childrenTextRange?.end ? childrenTextRange.end : previousSibling.end);
        }
        // Decrease the indent, if requested.
        if (format & ListFormat.Indented) {
            this.decreaseIndent();
        }
        // Write the closing line terminator or closing whitespace.
        const closingLineTerminatorCount = this.getClosingLineTerminatorCount(parentNode, children[start + count - 1], format, childrenTextRange);
        if (closingLineTerminatorCount) {
            this.writeLine(closingLineTerminatorCount);
        }
        else if (format & (ListFormat.SpaceAfterList | ListFormat.SpaceBetweenBraces)) {
            this.writeSpace();
        }
    }
    public writeLiteral(s: string) {
        (this.writer.writeLiteral)(s);
    }
    public writeStringLiteral(s: string) {
        (this.writer.writeStringLiteral)(s);
    }
    public writeBase(s: string) {
        (this.writer.write)(s);
    }
    public writeSymbol(s: string, sym: Symbol) {
        (this.writer.writeSymbol)(s, sym);
    }
    public writePunctuation(s: string) {
        (this.writer.writePunctuation)(s);
    }
    public writeTrailingSemicolon() {
        (this.writer.writeTrailingSemicolon)(";");
    }
    public writeKeyword(s: string) {
        (this.writer.writeKeyword)(s);
    }
    public writeOperator(s: string) {
        (this.writer.writeOperator)(s);
    }
    public writeParameter(s: string) {
        (this.writer.writeParameter)(s);
    }
    public writeComment(s: string) {
        (this.writer.writeComment)(s);
    }
    public writeSpace() {
        (this.writer.writeSpace)(" ");
    }
    public writeProperty(s: string) {
        (this.writer.writeProperty)(s);
    }
    public nonEscapingWrite(s: string) {
        // This should be defined in a snippet-escaping text writer.
        if (this.writer.nonEscapingWrite) {
            (this.writer.nonEscapingWrite)(s);
        }
        else {
            (this.writer.write)(s);
        }
    }
    public writeLine(count = 1) {
        for (let i = 0; i < count; i++) {
            (this.writer.writeLine)(i > 0);
        }
    }
    public increaseIndent() {
        (this.writer.increaseIndent)();
    }
    public decreaseIndent() {
        (this.writer.decreaseIndent)();
    }
    public writeToken(token: SyntaxKind, pos: number, writer: (s: string) => void, contextNode?: Node) {
        return !this.sourceMapsDisabled
            ? this.emitTokenWithSourceMap(contextNode, token, writer, pos, this.writeTokenText?.bind?.(this))
            : this.writeTokenText(token, writer, pos);
    }
    public writeTokenNode(node: Node, writer: (s: string) => void) {
        if (this.onBeforeEmitToken) {
            this.onBeforeEmitToken(node);
        }
        writer(tokenToString(node.kind)!);
        if (this.onAfterEmitToken) {
            this.onAfterEmitToken(node);
        }
    }
    public writeTokenText(token: SyntaxKind, writer: (s: string) => void): void;
    public writeTokenText(token: SyntaxKind, writer: (s: string) => void, pos: number): number;
    public writeTokenText(token: SyntaxKind, writer: (s: string) => void, pos?: number): number {
        const tokenString = tokenToString(token)!;
        writer(tokenString);
        return pos! < 0 ? pos! : pos! + tokenString.length;
    }
    public writeLineOrSpace(parentNode: Node, prevChildNode: Node, nextChildNode: Node) {
        if (getEmitFlags(parentNode) & EmitFlags.SingleLine) {
            this.writeSpace();
        }
        else if (this.preserveSourceNewlines) {
            const lines = this.getLinesBetweenNodes(parentNode, prevChildNode, nextChildNode);
            if (lines) {
                this.writeLine(lines);
            }
            else {
                this.writeSpace();
            }
        }
        else {
            this.writeLine();
        }
    }
    public writeLines(text: string): void {
        const lines = (text.split)(/\r\n?|\n/);
        const indentation = guessIndentation(lines);
        for (const lineText of lines) {
            const line = indentation ? (lineText.slice)(indentation) : lineText;
            if (line.length) {
                this.writeLine();
                this.write(line);
            }
        }
    }
    public writeLinesAndIndent(lineCount: number, writeSpaceIfNotIndenting: boolean) {
        if (lineCount) {
            this.increaseIndent();
            this.writeLine(lineCount);
        }
        else if (writeSpaceIfNotIndenting) {
            this.writeSpace();
        }
    }
    public decreaseIndentIf(value1: boolean | number | undefined, value2?: boolean | number) {
        if (value1) {
            this.decreaseIndent();
        }
        if (value2) {
            this.decreaseIndent();
        }
    }
    public getLeadingLineTerminatorCount(parentNode: Node | undefined, firstChild: Node | undefined, format: ListFormat): number {
        if (format & ListFormat.PreserveLines || this.preserveSourceNewlines) {
            if (format & ListFormat.PreferNewLine) {
                return 1;
            }
            if (firstChild === undefined) {
                return !parentNode || this.currentSourceFile && rangeIsOnSingleLine(parentNode, this.currentSourceFile) ? 0 : 1;
            }
            if (firstChild.pos === this.nextListElementPos) {
                // If this child starts at the beginning of a list item in a parent list, its leading
                // line terminators have already been written as the separating line terminators of the
                // parent list. Example:
                //
                // class Foo {
                //   constructor() {}
                //   public foo() {}
                // }
                //
                // The outer list is the list of class members, with one line terminator between the
                // constructor and the method. The constructor is written, the separating line terminator
                // is written, and then we start emitting the method. Its modifiers ([public]) constitute an inner
                // list, so we look for its leading line terminators. If we didn't know that we had already
                // written a newline as part of the parent list, it would appear that we need to write a
                // leading newline to start the modifiers.
                return 0;
            }
            if (firstChild.kind === SyntaxKind.JsxText) {
                // JsxText will be written with its leading whitespace, so don't add more manually.
                return 0;
            }
            if (this.currentSourceFile && parentNode &&
                !positionIsSynthesized(parentNode.pos) &&
                !nodeIsSynthesized(firstChild) &&
                (!firstChild.parent || getOriginalNode(firstChild.parent) === getOriginalNode(parentNode))) {
                if (this.preserveSourceNewlines) {
                    return this.getEffectiveLines(includeComments => getLinesBetweenPositionAndPrecedingNonWhitespaceCharacter(firstChild.pos, parentNode.pos, this.currentSourceFile!, includeComments));
                }
                return rangeStartPositionsAreOnSameLine(parentNode, firstChild, this.currentSourceFile) ? 0 : 1;
            }
            if (this.synthesizedNodeStartsOnNewLine(firstChild, format)) {
                return 1;
            }
        }
        return format & ListFormat.MultiLine ? 1 : 0;
    }
    public getSeparatingLineTerminatorCount(previousNode: Node | undefined, nextNode: Node, format: ListFormat): number {
        if (format & ListFormat.PreserveLines || this.preserveSourceNewlines) {
            if (previousNode === undefined || nextNode === undefined) {
                return 0;
            }
            if (nextNode.kind === SyntaxKind.JsxText) {
                // JsxText will be written with its leading whitespace, so don't add more manually.
                return 0;
            }
            else if (this.currentSourceFile && !nodeIsSynthesized(previousNode) && !nodeIsSynthesized(nextNode)) {
                if (this.preserveSourceNewlines && this.siblingNodePositionsAreComparable(previousNode, nextNode)) {
                    return this.getEffectiveLines(includeComments => getLinesBetweenRangeEndAndRangeStart(previousNode, nextNode, this.currentSourceFile!, includeComments));
                }
                // If `preserveSourceNewlines` is `false` we do not intend to preserve the effective lines between the
                // previous and next node. Instead we naively check whether nodes are on separate lines within the
                // same node parent. If so, we intend to preserve a single line terminator. This is less precise and
                // expensive than checking with `preserveSourceNewlines` as above, but the goal is not to preserve the
                // effective source lines between two sibling nodes.
                else if (!this.preserveSourceNewlines && this.originalNodesHaveSameParent(previousNode, nextNode)) {
                    return rangeEndIsOnSameLineAsRangeStart(previousNode, nextNode, this.currentSourceFile) ? 0 : 1;
                }
                // If the two nodes are not comparable, add a line terminator based on the format that can indicate
                // whether new lines are preferred or not.
                return format & ListFormat.PreferNewLine ? 1 : 0;
            }
            else if (this.synthesizedNodeStartsOnNewLine(previousNode, format) || this.synthesizedNodeStartsOnNewLine(nextNode, format)) {
                return 1;
            }
        }
        else if (getStartsOnNewLine(nextNode)) {
            return 1;
        }
        return format & ListFormat.MultiLine ? 1 : 0;
    }
    public getClosingLineTerminatorCount(parentNode: Node | undefined, lastChild: Node | undefined, format: ListFormat, childrenTextRange: TextRange | undefined): number {
        if (format & ListFormat.PreserveLines || this.preserveSourceNewlines) {
            if (format & ListFormat.PreferNewLine) {
                return 1;
            }
            if (lastChild === undefined) {
                return !parentNode || this.currentSourceFile && rangeIsOnSingleLine(parentNode, this.currentSourceFile) ? 0 : 1;
            }
            if (this.currentSourceFile && parentNode && !positionIsSynthesized(parentNode.pos) && !nodeIsSynthesized(lastChild) && (!lastChild.parent || lastChild.parent === parentNode)) {
                if (this.preserveSourceNewlines) {
                    const end = childrenTextRange && !positionIsSynthesized(childrenTextRange.end) ? childrenTextRange.end : lastChild.end;
                    return this.getEffectiveLines(includeComments => getLinesBetweenPositionAndNextNonWhitespaceCharacter(end, parentNode.end, this.currentSourceFile!, includeComments));
                }
                return rangeEndPositionsAreOnSameLine(parentNode, lastChild, this.currentSourceFile) ? 0 : 1;
            }
            if (this.synthesizedNodeStartsOnNewLine(lastChild, format)) {
                return 1;
            }
        }
        if (format & ListFormat.MultiLine && !(format & ListFormat.NoTrailingNewLine)) {
            return 1;
        }
        return 0;
    }
    public getEffectiveLines(getLineDifference: (includeComments: boolean) => number) {
        // If 'preserveSourceNewlines' is disabled, we should never call this function
        // because it could be more expensive than alternative approximations.
        (Debug.assert)(!!this.preserveSourceNewlines);
        // We start by measuring the line difference from a position to its adjacent comments,
        // so that this is counted as a one-line difference, not two:
        //
        //   node1;
        //   // NODE2 COMMENT
        //   node2;
        const lines = getLineDifference(/*includeComments*/ true);
        if (lines === 0) {
            // However, if the line difference considering comments was 0, we might have this:
            //
            //   node1; // NODE2 COMMENT
            //   node2;
            //
            // in which case we should be ignoring node2's comment, so this too is counted as
            // a one-line difference, not zero.
            return getLineDifference(/*includeComments*/ false);
        }
        return lines;
    }
    public writeLineSeparatorsAndIndentBefore(node: Node, parent: Node): boolean {
        const leadingNewlines = this.preserveSourceNewlines && this.getLeadingLineTerminatorCount(parent, node, ListFormat.None);
        if (leadingNewlines) {
            this.writeLinesAndIndent(leadingNewlines, /*writeSpaceIfNotIndenting*/ false);
        }
        return !!leadingNewlines;
    }
    public writeLineSeparatorsAfter(node: Node, parent: Node) {
        const trailingNewlines = this.preserveSourceNewlines && this.getClosingLineTerminatorCount(parent, node, ListFormat.None, /*childrenTextRange*/ undefined);
        if (trailingNewlines) {
            this.writeLine(trailingNewlines);
        }
    }
    public synthesizedNodeStartsOnNewLine(node: Node, format: ListFormat) {
        if (nodeIsSynthesized(node)) {
            const startsOnNewLine = getStartsOnNewLine(node);
            if (startsOnNewLine === undefined) {
                return (format & ListFormat.PreferNewLine) !== 0;
            }
            return startsOnNewLine;
        }
        return (format & ListFormat.PreferNewLine) !== 0;
    }
    public getLinesBetweenNodes(parent: Node, node1: Node, node2: Node): number {
        if (getEmitFlags(parent) & EmitFlags.NoIndentation) {
            return 0;
        }
        parent = this.skipSynthesizedParentheses(parent);
        node1 = this.skipSynthesizedParentheses(node1);
        node2 = this.skipSynthesizedParentheses(node2);
        // Always use a newline for synthesized code if the synthesizer desires it.
        if (getStartsOnNewLine(node2)) {
            return 1;
        }
        if (this.currentSourceFile && !nodeIsSynthesized(parent) && !nodeIsSynthesized(node1) && !nodeIsSynthesized(node2)) {
            if (this.preserveSourceNewlines) {
                return this.getEffectiveLines(includeComments => getLinesBetweenRangeEndAndRangeStart(node1, node2, this.currentSourceFile!, includeComments));
            }
            return rangeEndIsOnSameLineAsRangeStart(node1, node2, this.currentSourceFile) ? 0 : 1;
        }
        return 0;
    }
    public isEmptyBlock(block: BlockLike) {
        return block.statements.length === 0
            && (!this.currentSourceFile || rangeEndIsOnSameLineAsRangeStart(block, block, this.currentSourceFile));
    }
    public skipSynthesizedParentheses(node: Node) {
        while (node.kind === SyntaxKind.ParenthesizedExpression && nodeIsSynthesized(node)) {
            node = (node as ParenthesizedExpression).expression;
        }
        return node;
    }
    public getTextOfNode(node: Identifier | PrivateIdentifier | LiteralExpression | JsxNamespacedName, includeTrivia?: boolean): string {
        if (isGeneratedIdentifier(node) || isGeneratedPrivateIdentifier(node)) {
            return this.generateName(node);
        }
        if (isStringLiteral(node) && node.textSourceNode) {
            return this.getTextOfNode(node.textSourceNode, includeTrivia);
        }
        const sourceFile = this.currentSourceFile; // const needed for control flow
        const canUseSourceFile = !!sourceFile && !!node.parent && !nodeIsSynthesized(node);
        if (isMemberName(node)) {
            if (!canUseSourceFile || getSourceFileOfNode(node) !== getOriginalNode(sourceFile)) {
                return idText(node);
            }
        }
        else if (isJsxNamespacedName(node)) {
            if (!canUseSourceFile || getSourceFileOfNode(node) !== getOriginalNode(sourceFile)) {
                return getTextOfJsxNamespacedName(node);
            }
        }
        else {
            (Debug.assertNode)(node, isLiteralExpression); // not strictly necessary
            if (!canUseSourceFile) {
                return node.text;
            }
        }
        return getSourceTextOfNodeFromSourceFile(sourceFile, node, includeTrivia);
    }
    public getLiteralTextOfNode(node: LiteralLikeNode, sourceFile = this.currentSourceFile, neverAsciiEscape: boolean | undefined, jsxAttributeEscape: boolean): string {
        if (node.kind === SyntaxKind.StringLiteral && (node as StringLiteral).textSourceNode) {
            const textSourceNode = ((node as StringLiteral).textSourceNode)!;
            if (isIdentifier(textSourceNode) || isPrivateIdentifier(textSourceNode) || isNumericLiteral(textSourceNode) || isJsxNamespacedName(textSourceNode)) {
                const text = isNumericLiteral(textSourceNode) ? textSourceNode.text : this.getTextOfNode(textSourceNode);
                return jsxAttributeEscape ? `"${escapeJsxAttributeString(text)}"` :
                    neverAsciiEscape || (getEmitFlags(node) & EmitFlags.NoAsciiEscaping) ? `"${escapeString(text)}"` :
                        `"${escapeNonAsciiString(text)}"`;
            }
            else {
                return this.getLiteralTextOfNode(textSourceNode, getSourceFileOfNode(textSourceNode), neverAsciiEscape, jsxAttributeEscape);
            }
        }
        const flags = (neverAsciiEscape ? GetLiteralTextFlags.NeverAsciiEscape : 0)
            | (jsxAttributeEscape ? GetLiteralTextFlags.JsxAttributeEscape : 0)
            | (this.printerOptions.terminateUnterminatedLiterals ? GetLiteralTextFlags.TerminateUnterminatedLiterals : 0)
            | (this.printerOptions.target && this.printerOptions.target >= ScriptTarget.ES2021 ? GetLiteralTextFlags.AllowNumericSeparator : 0);
        return getLiteralText(node, sourceFile, flags);
    }
    public pushNameGenerationScope(node: Node | undefined) {
        (this.privateNameTempFlagsStack.push)(this.privateNameTempFlags);
        this.privateNameTempFlags = TempFlags.Auto;
        (this.reservedPrivateNamesStack.push)(this.reservedPrivateNames);
        if (node && getEmitFlags(node) & EmitFlags.ReuseTempVariableScope) {
            return;
        }
        (this.tempFlagsStack.push)(this.tempFlags);
        this.tempFlags = TempFlags.Auto;
        (this.formattedNameTempFlagsStack.push)(this.formattedNameTempFlags);
        this.formattedNameTempFlags = undefined;
        (this.reservedNamesStack.push)(this.reservedNames);
    }
    public popNameGenerationScope(node: Node | undefined) {
        this.privateNameTempFlags = (this.privateNameTempFlagsStack.pop)()!;
        this.reservedPrivateNames = (this.reservedPrivateNamesStack.pop)();
        if (node && getEmitFlags(node) & EmitFlags.ReuseTempVariableScope) {
            return;
        }
        this.tempFlags = (this.tempFlagsStack.pop)()!;
        this.formattedNameTempFlags = (this.formattedNameTempFlagsStack.pop)();
        this.reservedNames = (this.reservedNamesStack.pop)();
    }
    public reserveNameInNestedScopes(name: string) {
        if (!this.reservedNames || this.reservedNames === lastOrUndefined(this.reservedNamesStack)) {
            this.reservedNames = new Set();
        }
        (this.reservedNames.add)(name);
    }
    public reservePrivateNameInNestedScopes(name: string) {
        if (!this.reservedPrivateNames || this.reservedPrivateNames === lastOrUndefined(this.reservedPrivateNamesStack)) {
            this.reservedPrivateNames = new Set();
        }
        (this.reservedPrivateNames.add)(name);
    }
    public generateNames(node: Node | undefined) {
        if (!node)
            return;
        switch (node.kind) {
            case SyntaxKind.Block:
                forEach((node as Block).statements, this.generateNames?.bind?.(this));
                break;
            case SyntaxKind.LabeledStatement:
            case SyntaxKind.WithStatement:
            case SyntaxKind.DoStatement:
            case SyntaxKind.WhileStatement:
                this.generateNames((node as LabeledStatement | WithStatement | DoStatement | WhileStatement).statement);
                break;
            case SyntaxKind.IfStatement:
                this.generateNames((node as IfStatement).thenStatement);
                this.generateNames((node as IfStatement).elseStatement);
                break;
            case SyntaxKind.ForStatement:
            case SyntaxKind.ForOfStatement:
            case SyntaxKind.ForInStatement:
                this.generateNames((node as ForStatement | ForInOrOfStatement).initializer);
                this.generateNames((node as ForStatement | ForInOrOfStatement).statement);
                break;
            case SyntaxKind.SwitchStatement:
                this.generateNames((node as SwitchStatement).caseBlock);
                break;
            case SyntaxKind.CaseBlock:
                forEach((node as CaseBlock).clauses, this.generateNames?.bind?.(this));
                break;
            case SyntaxKind.CaseClause:
            case SyntaxKind.DefaultClause:
                forEach((node as CaseOrDefaultClause).statements, this.generateNames?.bind?.(this));
                break;
            case SyntaxKind.TryStatement:
                this.generateNames((node as TryStatement).tryBlock);
                this.generateNames((node as TryStatement).catchClause);
                this.generateNames((node as TryStatement).finallyBlock);
                break;
            case SyntaxKind.CatchClause:
                this.generateNames((node as CatchClause).variableDeclaration);
                this.generateNames((node as CatchClause).block);
                break;
            case SyntaxKind.VariableStatement:
                this.generateNames((node as VariableStatement).declarationList);
                break;
            case SyntaxKind.VariableDeclarationList:
                forEach((node as VariableDeclarationList).declarations, this.generateNames?.bind?.(this));
                break;
            case SyntaxKind.VariableDeclaration:
            case SyntaxKind.Parameter:
            case SyntaxKind.BindingElement:
            case SyntaxKind.ClassDeclaration:
                this.generateNameIfNeeded((node as NamedDeclaration).name);
                break;
            case SyntaxKind.FunctionDeclaration:
                this.generateNameIfNeeded((node as FunctionDeclaration).name);
                if (getEmitFlags(node) & EmitFlags.ReuseTempVariableScope) {
                    forEach((node as FunctionDeclaration).parameters, this.generateNames?.bind?.(this));
                    this.generateNames((node as FunctionDeclaration).body);
                }
                break;
            case SyntaxKind.ObjectBindingPattern:
            case SyntaxKind.ArrayBindingPattern:
                forEach((node as BindingPattern).elements, this.generateNames?.bind?.(this));
                break;
            case SyntaxKind.ImportDeclaration:
                this.generateNames((node as ImportDeclaration).importClause);
                break;
            case SyntaxKind.ImportClause:
                this.generateNameIfNeeded((node as ImportClause).name);
                this.generateNames((node as ImportClause).namedBindings);
                break;
            case SyntaxKind.NamespaceImport:
                this.generateNameIfNeeded((node as NamespaceImport).name);
                break;
            case SyntaxKind.NamespaceExport:
                this.generateNameIfNeeded((node as NamespaceExport).name);
                break;
            case SyntaxKind.NamedImports:
                forEach((node as NamedImports).elements, this.generateNames?.bind?.(this));
                break;
            case SyntaxKind.ImportSpecifier:
                this.generateNameIfNeeded((node as ImportSpecifier).propertyName || (node as ImportSpecifier).name);
                break;
        }
    }
    public generateMemberNames(node: Node | undefined) {
        if (!node)
            return;
        switch (node.kind) {
            case SyntaxKind.PropertyAssignment:
            case SyntaxKind.ShorthandPropertyAssignment:
            case SyntaxKind.PropertyDeclaration:
            case SyntaxKind.PropertySignature:
            case SyntaxKind.MethodDeclaration:
            case SyntaxKind.MethodSignature:
            case SyntaxKind.GetAccessor:
            case SyntaxKind.SetAccessor:
                this.generateNameIfNeeded((node as NamedDeclaration).name);
                break;
        }
    }
    public generateNameIfNeeded(name: DeclarationName | undefined) {
        if (name) {
            if (isGeneratedIdentifier(name) || isGeneratedPrivateIdentifier(name)) {
                this.generateName(name);
            }
            else if (isBindingPattern(name)) {
                this.generateNames(name);
            }
        }
    }
    public generateName(name: GeneratedIdentifier | GeneratedPrivateIdentifier) {
        const autoGenerate = name.emitNode.autoGenerate;
        if ((autoGenerate.flags & GeneratedIdentifierFlags.KindMask) === GeneratedIdentifierFlags.Node) {
            // Node names generate unique names based on their original node
            // and are cached based on that node's id.
            return this.generateNameCached(getNodeForGeneratedName(name), isPrivateIdentifier(name), autoGenerate.flags, autoGenerate.prefix, autoGenerate.suffix);
        }
        else {
            // Auto, Loop, and Unique names are cached based on their unique
            // autoGenerateId.
            const autoGenerateId = autoGenerate.id;
            return this.autoGeneratedIdToGeneratedName[autoGenerateId] || (this.autoGeneratedIdToGeneratedName[autoGenerateId] = this.makeName(name));
        }
    }
    public generateNameCached(node: Node, privateName: boolean, flags?: GeneratedIdentifierFlags, prefix?: string | GeneratedNamePart, suffix?: string) {
        const nodeId = getNodeId(node);
        const cache = privateName ? this.nodeIdToGeneratedPrivateName : this.nodeIdToGeneratedName;
        return cache[nodeId] || (cache[nodeId] = this.generateNameForNode(node, privateName, flags ?? GeneratedIdentifierFlags.None, formatGeneratedNamePart(prefix, this.generateName?.bind?.(this)), formatGeneratedNamePart(suffix)));
    }
    public isUniqueName(name: string, privateName: boolean): boolean {
        return this.isFileLevelUniqueNameInCurrentFile(name, privateName)
            && !this.isReservedName(name, privateName)
            && !(this.generatedNames.has)(name);
    }
    public isReservedName(name: string, privateName: boolean): boolean {
        let set: Set<string> | undefined;
        let stack: (Set<string> | undefined)[];
        if (privateName) {
            set = this.reservedPrivateNames;
            stack = this.reservedPrivateNamesStack;
        }
        else {
            set = this.reservedNames;
            stack = this.reservedNamesStack;
        }
        if (set?.has(name)) {
            return true;
        }
        for (let i = stack.length - 1; i >= 0; i--) {
            if (set === stack[i]) {
                continue;
            }
            set = stack[i];
            if (set?.has(name)) {
                return true;
            }
        }
        return false;
    }
    public isFileLevelUniqueNameInCurrentFile(name: string, _isPrivate: boolean) {
        return this.currentSourceFile ? isFileLevelUniqueName(this.currentSourceFile, name, this.hasGlobalName) : true;
    }
    public isUniqueLocalName(name: string, container: HasLocals | undefined): boolean {
        for (let node = container; node && isNodeDescendantOf(node, container); node = node.nextContainer) {
            if (canHaveLocals(node) && node.locals) {
                const local = (node.locals.get)(escapeLeadingUnderscores(name));
                // We conservatively include alias symbols to cover cases where they're emitted as locals
                if (local && local.flags & (SymbolFlags.Value | SymbolFlags.ExportValue | SymbolFlags.Alias)) {
                    return false;
                }
            }
        }
        return true;
    }
    public getTempFlags(formattedNameKey: string) {
        switch (formattedNameKey) {
            case "":
                return this.tempFlags;
            case "#":
                return this.privateNameTempFlags;
            default:
                return this.formattedNameTempFlags?.get(formattedNameKey) ?? TempFlags.Auto;
        }
    }
    public setTempFlags(formattedNameKey: string, flags: TempFlags) {
        switch (formattedNameKey) {
            case "":
                this.tempFlags = flags;
                break;
            case "#":
                this.privateNameTempFlags = flags;
                break;
            default:
                this.formattedNameTempFlags ??= new Map();
                (this.formattedNameTempFlags.set)(formattedNameKey, flags);
                break;
        }
    }
    public makeTempVariableName(flags: TempFlags, reservedInNestedScopes: boolean, privateName: boolean, prefix: string, suffix: string): string {
        if (prefix.length > 0 && (prefix.charCodeAt)(0) === CharacterCodes.hash) {
            prefix = (prefix.slice)(1);
        }
        // Generate a key to use to acquire a TempFlags counter based on the fixed portions of the generated name.
        const key = formatGeneratedName(privateName, prefix, "", suffix);
        let tempFlags = this.getTempFlags(key);
        if (flags && !(tempFlags & flags)) {
            const name = flags === TempFlags._i ? "_i" : "_n";
            const fullName = formatGeneratedName(privateName, prefix, name, suffix);
            if (this.isUniqueName(fullName, privateName)) {
                tempFlags |= flags;
                if (privateName) {
                    this.reservePrivateNameInNestedScopes(fullName);
                }
                else if (reservedInNestedScopes) {
                    this.reserveNameInNestedScopes(fullName);
                }
                this.setTempFlags(key, tempFlags);
                return fullName;
            }
        }
        while (true) {
            const count = tempFlags & TempFlags.CountMask;
            tempFlags++;
            // Skip over 'i' and 'n'
            if (count !== 8 && count !== 13) {
                const name = count < 26
                    ? "_" + (String.fromCharCode)(CharacterCodes.a + count)
                    : "_" + (count - 26);
                const fullName = formatGeneratedName(privateName, prefix, name, suffix);
                if (this.isUniqueName(fullName, privateName)) {
                    if (privateName) {
                        this.reservePrivateNameInNestedScopes(fullName);
                    }
                    else if (reservedInNestedScopes) {
                        this.reserveNameInNestedScopes(fullName);
                    }
                    this.setTempFlags(key, tempFlags);
                    return fullName;
                }
            }
        }
    }
    public makeUniqueName(baseName: string, checkFn: (name: string, privateName: boolean) => boolean = this.isUniqueName?.bind?.(this), optimistic: boolean, scoped: boolean, privateName: boolean, prefix: string, suffix: string): string {
        if (baseName.length > 0 && (baseName.charCodeAt)(0) === CharacterCodes.hash) {
            baseName = (baseName.slice)(1);
        }
        if (prefix.length > 0 && (prefix.charCodeAt)(0) === CharacterCodes.hash) {
            prefix = (prefix.slice)(1);
        }
        if (optimistic) {
            const fullName = formatGeneratedName(privateName, prefix, baseName, suffix);
            if (checkFn(fullName, privateName)) {
                if (privateName) {
                    this.reservePrivateNameInNestedScopes(fullName);
                }
                else if (scoped) {
                    this.reserveNameInNestedScopes(fullName);
                }
                else {
                    (this.generatedNames.add)(fullName);
                }
                return fullName;
            }
        }
        // Find the first unique 'name_n', where n is a positive number
        if ((baseName.charCodeAt)(baseName.length - 1) !== CharacterCodes._) {
            baseName += "_";
        }
        let i = 1;
        while (true) {
            const fullName = formatGeneratedName(privateName, prefix, baseName + i, suffix);
            if (checkFn(fullName, privateName)) {
                if (privateName) {
                    this.reservePrivateNameInNestedScopes(fullName);
                }
                else if (scoped) {
                    this.reserveNameInNestedScopes(fullName);
                }
                else {
                    (this.generatedNames.add)(fullName);
                }
                return fullName;
            }
            i++;
        }
    }
    public makeFileLevelOptimisticUniqueName(name: string) {
        return this.makeUniqueName(name, this.isFileLevelUniqueNameInCurrentFile?.bind?.(this), /*optimistic*/ true, /*scoped*/ false, /*privateName*/ false, /*prefix*/ "", /*suffix*/ "");
    }
    public generateNameForModuleOrEnum(node: ModuleDeclaration | EnumDeclaration) {
        const name = this.getTextOfNode(node.name);
        // Use module/enum name itself if it is unique, otherwise make a unique variation
        return this.isUniqueLocalName(name, tryCast(node, canHaveLocals)) ? name : this.makeUniqueName(name, this.isUniqueName?.bind?.(this), /*optimistic*/ false, /*scoped*/ false, /*privateName*/ false, /*prefix*/ "", /*suffix*/ "");
    }
    public generateNameForImportOrExportDeclaration(node: ImportDeclaration | ExportDeclaration) {
        const expr = getExternalModuleName(node)!; // TODO: GH#18217
        const baseName = isStringLiteral(expr) ?
            makeIdentifierFromModuleName(expr.text) : "module";
        return this.makeUniqueName(baseName, this.isUniqueName?.bind?.(this), /*optimistic*/ false, /*scoped*/ false, /*privateName*/ false, /*prefix*/ "", /*suffix*/ "");
    }
    public generateNameForExportDefault() {
        return this.makeUniqueName("default", this.isUniqueName?.bind?.(this), /*optimistic*/ false, /*scoped*/ false, /*privateName*/ false, /*prefix*/ "", /*suffix*/ "");
    }
    public generateNameForClassExpression() {
        return this.makeUniqueName("class", this.isUniqueName?.bind?.(this), /*optimistic*/ false, /*scoped*/ false, /*privateName*/ false, /*prefix*/ "", /*suffix*/ "");
    }
    public generateNameForMethodOrAccessor(node: MethodDeclaration | AccessorDeclaration, privateName: boolean, prefix: string, suffix: string) {
        if (isIdentifier(node.name)) {
            return this.generateNameCached(node.name, privateName);
        }
        return this.makeTempVariableName(TempFlags.Auto, /*reservedInNestedScopes*/ false, privateName, prefix, suffix);
    }
    public generateNameForNode(node: Node, privateName: boolean, flags: GeneratedIdentifierFlags, prefix: string, suffix: string): string {
        switch (node.kind) {
            case SyntaxKind.Identifier:
            case SyntaxKind.PrivateIdentifier:
                return this.makeUniqueName(this.getTextOfNode(node as Identifier), this.isUniqueName?.bind?.(this), !!(flags & GeneratedIdentifierFlags.Optimistic), !!(flags & GeneratedIdentifierFlags.ReservedInNestedScopes), privateName, prefix, suffix);
            case SyntaxKind.ModuleDeclaration:
            case SyntaxKind.EnumDeclaration:
                (Debug.assert)(!prefix && !suffix && !privateName);
                return this.generateNameForModuleOrEnum(node as ModuleDeclaration | EnumDeclaration);
            case SyntaxKind.ImportDeclaration:
            case SyntaxKind.ExportDeclaration:
                (Debug.assert)(!prefix && !suffix && !privateName);
                return this.generateNameForImportOrExportDeclaration(node as ImportDeclaration | ExportDeclaration);
            case SyntaxKind.FunctionDeclaration:
            case SyntaxKind.ClassDeclaration: {
                (Debug.assert)(!prefix && !suffix && !privateName);
                const name = (node as ClassDeclaration | FunctionDeclaration).name;
                if (name && !isGeneratedIdentifier(name)) {
                    return this.generateNameForNode(name, /*privateName*/ false, flags, prefix, suffix);
                }
                return this.generateNameForExportDefault();
            }
            case SyntaxKind.ExportAssignment:
                (Debug.assert)(!prefix && !suffix && !privateName);
                return this.generateNameForExportDefault();
            case SyntaxKind.ClassExpression:
                (Debug.assert)(!prefix && !suffix && !privateName);
                return this.generateNameForClassExpression();
            case SyntaxKind.MethodDeclaration:
            case SyntaxKind.GetAccessor:
            case SyntaxKind.SetAccessor:
                return this.generateNameForMethodOrAccessor(node as MethodDeclaration | AccessorDeclaration, privateName, prefix, suffix);
            case SyntaxKind.ComputedPropertyName:
                return this.makeTempVariableName(TempFlags.Auto, /*reservedInNestedScopes*/ true, privateName, prefix, suffix);
            default:
                return this.makeTempVariableName(TempFlags.Auto, /*reservedInNestedScopes*/ false, privateName, prefix, suffix);
        }
    }
    public makeName(name: GeneratedIdentifier | GeneratedPrivateIdentifier) {
        const autoGenerate = name.emitNode.autoGenerate;
        const prefix = formatGeneratedNamePart(autoGenerate.prefix, this.generateName?.bind?.(this));
        const suffix = formatGeneratedNamePart(autoGenerate.suffix);
        switch (autoGenerate.flags & GeneratedIdentifierFlags.KindMask) {
            case GeneratedIdentifierFlags.Auto:
                return this.makeTempVariableName(TempFlags.Auto, !!(autoGenerate.flags & GeneratedIdentifierFlags.ReservedInNestedScopes), isPrivateIdentifier(name), prefix, suffix);
            case GeneratedIdentifierFlags.Loop:
                (Debug.assertNode)(name, isIdentifier);
                return this.makeTempVariableName(TempFlags._i, !!(autoGenerate.flags & GeneratedIdentifierFlags.ReservedInNestedScopes), /*privateName*/ false, prefix, suffix);
            case GeneratedIdentifierFlags.Unique:
                return this.makeUniqueName(idText(name), (autoGenerate.flags & GeneratedIdentifierFlags.FileLevel) ? this.isFileLevelUniqueNameInCurrentFile?.bind?.(this) : this.isUniqueName?.bind?.(this), !!(autoGenerate.flags & GeneratedIdentifierFlags.Optimistic), !!(autoGenerate.flags & GeneratedIdentifierFlags.ReservedInNestedScopes), isPrivateIdentifier(name), prefix, suffix);
        }
        return (Debug.fail)(`Unsupported GeneratedIdentifierKind: ${(Debug.formatEnum)(autoGenerate.flags & GeneratedIdentifierFlags.KindMask, (ts as any).GeneratedIdentifierFlags, /*isFlags*/ true)}.`);
    }
    public pipelineEmitWithComments(hint: EmitHint, node: Node) {
        const pipelinePhase = this.getNextPipelinePhase(PipelinePhase.Comments, hint, node);
        const savedContainerPos = this.containerPos;
        const savedContainerEnd = this.containerEnd;
        const savedDeclarationListContainerEnd = this.declarationListContainerEnd;
        this.emitCommentsBeforeNode(node);
        pipelinePhase(hint, node);
        this.emitCommentsAfterNode(node, savedContainerPos, savedContainerEnd, savedDeclarationListContainerEnd);
    }
    public emitCommentsBeforeNode(node: Node) {
        const emitFlags = getEmitFlags(node);
        const commentRange = getCommentRange(node);
        // Emit leading comments
        this.emitLeadingCommentsOfNode(node, emitFlags, commentRange.pos, commentRange.end);
        if (emitFlags & EmitFlags.NoNestedComments) {
            this.commentsDisabled = true;
        }
    }
    public emitCommentsAfterNode(node: Node, savedContainerPos: number, savedContainerEnd: number, savedDeclarationListContainerEnd: number) {
        const emitFlags = getEmitFlags(node);
        const commentRange = getCommentRange(node);
        // Emit trailing comments
        if (emitFlags & EmitFlags.NoNestedComments) {
            this.commentsDisabled = false;
        }
        this.emitTrailingCommentsOfNode(node, emitFlags, commentRange.pos, commentRange.end, savedContainerPos, savedContainerEnd, savedDeclarationListContainerEnd);
        const typeNode = getTypeNode(node);
        if (typeNode) {
            this.emitTrailingCommentsOfNode(node, emitFlags, typeNode.pos, typeNode.end, savedContainerPos, savedContainerEnd, savedDeclarationListContainerEnd);
        }
    }
    public emitLeadingCommentsOfNode(node: Node, emitFlags: EmitFlags, pos: number, end: number) {
        this.enterComment();
        this.hasWrittenComment = false;
        // We have to explicitly check that the node is JsxText because if the compilerOptions.jsx is "preserve" we will not do any transformation.
        // It is expensive to walk entire tree just to set one kind of node to have no comments.
        const skipLeadingComments = pos < 0 || (emitFlags & EmitFlags.NoLeadingComments) !== 0 || node.kind === SyntaxKind.JsxText;
        const skipTrailingComments = end < 0 || (emitFlags & EmitFlags.NoTrailingComments) !== 0 || node.kind === SyntaxKind.JsxText;
        // Save current container state on the stack.
        if ((pos > 0 || end > 0) && pos !== end) {
            // Emit leading comments if the position is not synthesized and the node
            // has not opted out from emitting leading comments.
            if (!skipLeadingComments) {
                this.emitLeadingComments(pos, /*isEmittedNode*/ node.kind !== SyntaxKind.NotEmittedStatement);
            }
            if (!skipLeadingComments || (pos >= 0 && (emitFlags & EmitFlags.NoLeadingComments) !== 0)) {
                // Advance the container position if comments get emitted or if they've been disabled explicitly using NoLeadingComments.
                this.containerPos = pos;
            }
            if (!skipTrailingComments || (end >= 0 && (emitFlags & EmitFlags.NoTrailingComments) !== 0)) {
                // As above.
                this.containerEnd = end;
                // To avoid invalid comment emit in a down-level binding pattern, we
                // keep track of the last declaration list container's end
                if (node.kind === SyntaxKind.VariableDeclarationList) {
                    this.declarationListContainerEnd = end;
                }
            }
        }
        forEach(getSyntheticLeadingComments(node), this.emitLeadingSynthesizedComment?.bind?.(this));
        this.exitComment();
    }
    public emitTrailingCommentsOfNode(node: Node, emitFlags: EmitFlags, pos: number, end: number, savedContainerPos: number, savedContainerEnd: number, savedDeclarationListContainerEnd: number) {
        this.enterComment();
        const skipTrailingComments = end < 0 || (emitFlags & EmitFlags.NoTrailingComments) !== 0 || node.kind === SyntaxKind.JsxText;
        forEach(getSyntheticTrailingComments(node), this.emitTrailingSynthesizedComment?.bind?.(this));
        if ((pos > 0 || end > 0) && pos !== end) {
            // Restore previous container state.
            this.containerPos = savedContainerPos;
            this.containerEnd = savedContainerEnd;
            this.declarationListContainerEnd = savedDeclarationListContainerEnd;
            // Emit trailing comments if the position is not synthesized and the node
            // has not opted out from emitting leading comments and is an emitted node.
            if (!skipTrailingComments && node.kind !== SyntaxKind.NotEmittedStatement) {
                this.emitTrailingComments(end);
            }
        }
        this.exitComment();
    }
    public emitLeadingSynthesizedComment(comment: SynthesizedComment) {
        if (comment.hasLeadingNewline || comment.kind === SyntaxKind.SingleLineCommentTrivia) {
            (this.writer.writeLine)();
        }
        this.writeSynthesizedComment(comment);
        if (comment.hasTrailingNewLine || comment.kind === SyntaxKind.SingleLineCommentTrivia) {
            (this.writer.writeLine)();
        }
        else {
            (this.writer.writeSpace)(" ");
        }
    }
    public emitTrailingSynthesizedComment(comment: SynthesizedComment) {
        if (!(this.writer.isAtStartOfLine)()) {
            (this.writer.writeSpace)(" ");
        }
        this.writeSynthesizedComment(comment);
        if (comment.hasTrailingNewLine) {
            (this.writer.writeLine)();
        }
    }
    public writeSynthesizedComment(comment: SynthesizedComment) {
        const text = this.formatSynthesizedComment(comment);
        const lineMap = comment.kind === SyntaxKind.MultiLineCommentTrivia ? computeLineStarts(text) : undefined;
        writeCommentRange(text, lineMap!, this.writer, 0, text.length, this.newLine);
    }
    public formatSynthesizedComment(comment: SynthesizedComment) {
        return comment.kind === SyntaxKind.MultiLineCommentTrivia
            ? `/*${comment.text}*/`
            : `//${comment.text}`;
    }
    public emitBodyWithDetachedComments<T extends Node>(node: T, detachedRange: TextRange, emitCallback: (node: T) => void) {
        this.enterComment();
        const { pos, end } = detachedRange;
        const emitFlags = getEmitFlags(node);
        const skipLeadingComments = pos < 0 || (emitFlags & EmitFlags.NoLeadingComments) !== 0;
        const skipTrailingComments = this.commentsDisabled || end < 0 || (emitFlags & EmitFlags.NoTrailingComments) !== 0;
        if (!skipLeadingComments) {
            this.emitDetachedCommentsAndUpdateCommentsInfo(detachedRange);
        }
        this.exitComment();
        if (emitFlags & EmitFlags.NoNestedComments && !this.commentsDisabled) {
            this.commentsDisabled = true;
            emitCallback(node);
            this.commentsDisabled = false;
        }
        else {
            emitCallback(node);
        }
        this.enterComment();
        if (!skipTrailingComments) {
            this.emitLeadingComments(detachedRange.end, /*isEmittedNode*/ true);
            if (this.hasWrittenComment && !(this.writer.isAtStartOfLine)()) {
                (this.writer.writeLine)();
            }
        }
        this.exitComment();
    }
    public originalNodesHaveSameParent(nodeA: Node, nodeB: Node) {
        nodeA = getOriginalNode(nodeA);
        // For performance, do not call `getOriginalNode` for `nodeB` if `nodeA` doesn't even
        // have a parent node.
        return nodeA.parent && nodeA.parent === getOriginalNode(nodeB).parent;
    }
    public siblingNodePositionsAreComparable(previousNode: Node, nextNode: Node) {
        if (nextNode.pos < previousNode.end) {
            return false;
        }
        previousNode = getOriginalNode(previousNode);
        nextNode = getOriginalNode(nextNode);
        const parent = previousNode.parent;
        if (!parent || parent !== nextNode.parent) {
            return false;
        }
        const parentNodeArray = getContainingNodeArray(previousNode);
        const prevNodeIndex = parentNodeArray?.indexOf(previousNode);
        return prevNodeIndex !== undefined && prevNodeIndex > -1 && (parentNodeArray!.indexOf)(nextNode) === prevNodeIndex + 1;
    }
    public emitLeadingComments(pos: number, isEmittedNode: boolean) {
        this.hasWrittenComment = false;
        if (isEmittedNode) {
            if (pos === 0 && this.currentSourceFile?.isDeclarationFile) {
                this.forEachLeadingCommentToEmit(pos, this.emitNonTripleSlashLeadingComment?.bind?.(this));
            }
            else {
                this.forEachLeadingCommentToEmit(pos, this.emitLeadingComment?.bind?.(this));
            }
        }
        else if (pos === 0) {
            // If the node will not be emitted in JS, remove all the comments(normal, pinned and ///) associated with the node,
            // unless it is a triple slash comment at the top of the file.
            // For Example:
            //      /// <reference-path ...>
            //      declare var x;
            //      /// <reference-path ...>
            //      interface F {}
            //  The first /// will NOT be removed while the second one will be removed even though both node will not be emitted
            this.forEachLeadingCommentToEmit(pos, this.emitTripleSlashLeadingComment?.bind?.(this));
        }
    }
    public emitTripleSlashLeadingComment(commentPos: number, commentEnd: number, kind: SyntaxKind, hasTrailingNewLine: boolean, rangePos: number) {
        if (this.isTripleSlashComment(commentPos, commentEnd)) {
            this.emitLeadingComment(commentPos, commentEnd, kind, hasTrailingNewLine, rangePos);
        }
    }
    public emitNonTripleSlashLeadingComment(commentPos: number, commentEnd: number, kind: SyntaxKind, hasTrailingNewLine: boolean, rangePos: number) {
        if (!this.isTripleSlashComment(commentPos, commentEnd)) {
            this.emitLeadingComment(commentPos, commentEnd, kind, hasTrailingNewLine, rangePos);
        }
    }
    public shouldWriteComment(text: string, pos: number) {
        if (this.printerOptions.onlyPrintJsDocStyle) {
            return (isJSDocLikeText(text, pos) || isPinnedComment(text, pos));
        }
        return true;
    }
    public emitLeadingComment(commentPos: number, commentEnd: number, kind: SyntaxKind, hasTrailingNewLine: boolean, rangePos: number) {
        if (!this.currentSourceFile || !this.shouldWriteComment(this.currentSourceFile.text, commentPos))
            return;
        if (!this.hasWrittenComment) {
            emitNewLineBeforeLeadingCommentOfPosition(this.getCurrentLineMap(), this.writer, rangePos, commentPos);
            this.hasWrittenComment = true;
        }
        // Leading comments are emitted at /*leading comment1 */space/*leading comment*/space
        this.emitPos(commentPos);
        writeCommentRange(this.currentSourceFile.text, this.getCurrentLineMap(), this.writer, commentPos, commentEnd, this.newLine);
        this.emitPos(commentEnd);
        if (hasTrailingNewLine) {
            (this.writer.writeLine)();
        }
        else if (kind === SyntaxKind.MultiLineCommentTrivia) {
            (this.writer.writeSpace)(" ");
        }
    }
    public emitLeadingCommentsOfPosition(pos: number) {
        if (this.commentsDisabled || pos === -1) {
            return;
        }
        this.emitLeadingComments(pos, /*isEmittedNode*/ true);
    }
    public emitTrailingComments(pos: number) {
        this.forEachTrailingCommentToEmit(pos, this.emitTrailingComment?.bind?.(this));
    }
    public emitTrailingComment(commentPos: number, commentEnd: number, _kind: SyntaxKind, hasTrailingNewLine: boolean) {
        if (!this.currentSourceFile || !this.shouldWriteComment(this.currentSourceFile.text, commentPos))
            return;
        // trailing comments are emitted at space/*trailing comment1 */space/*trailing comment2*/
        if (!(this.writer.isAtStartOfLine)()) {
            (this.writer.writeSpace)(" ");
        }
        this.emitPos(commentPos);
        writeCommentRange(this.currentSourceFile.text, this.getCurrentLineMap(), this.writer, commentPos, commentEnd, this.newLine);
        this.emitPos(commentEnd);
        if (hasTrailingNewLine) {
            (this.writer.writeLine)();
        }
    }
    public emitTrailingCommentsOfPosition(pos: number, prefixSpace?: boolean, forceNoNewline?: boolean) {
        if (this.commentsDisabled) {
            return;
        }
        this.enterComment();
        this.forEachTrailingCommentToEmit(pos, prefixSpace ? this.emitTrailingComment?.bind?.(this) : forceNoNewline ? this.emitTrailingCommentOfPositionNoNewline?.bind?.(this) : this.emitTrailingCommentOfPosition?.bind?.(this));
        this.exitComment();
    }
    public emitTrailingCommentOfPositionNoNewline(commentPos: number, commentEnd: number, kind: SyntaxKind) {
        if (!this.currentSourceFile)
            return;
        // trailing comments of a position are emitted at /*trailing comment1 */space/*trailing comment*/space
        this.emitPos(commentPos);
        writeCommentRange(this.currentSourceFile.text, this.getCurrentLineMap(), this.writer, commentPos, commentEnd, this.newLine);
        this.emitPos(commentEnd);
        if (kind === SyntaxKind.SingleLineCommentTrivia) {
            (this.writer.writeLine)(); // still write a newline for single-line comments, so closing tokens aren't written on the same line
        }
    }
    public emitTrailingCommentOfPosition(commentPos: number, commentEnd: number, _kind: SyntaxKind, hasTrailingNewLine: boolean) {
        if (!this.currentSourceFile)
            return;
        // trailing comments of a position are emitted at /*trailing comment1 */space/*trailing comment*/space
        this.emitPos(commentPos);
        writeCommentRange(this.currentSourceFile.text, this.getCurrentLineMap(), this.writer, commentPos, commentEnd, this.newLine);
        this.emitPos(commentEnd);
        if (hasTrailingNewLine) {
            (this.writer.writeLine)();
        }
        else {
            (this.writer.writeSpace)(" ");
        }
    }
    public forEachLeadingCommentToEmit(pos: number, cb: (commentPos: number, commentEnd: number, kind: SyntaxKind, hasTrailingNewLine: boolean, rangePos: number) => void) {
        // Emit the leading comments only if the container's pos doesn't match because the container should take care of emitting these comments
        if (this.currentSourceFile && (this.containerPos === -1 || pos !== this.containerPos)) {
            if (this.hasDetachedComments(pos)) {
                this.forEachLeadingCommentWithoutDetachedComments(cb);
            }
            else {
                forEachLeadingCommentRange(this.currentSourceFile.text, pos, cb, /*state*/ pos);
            }
        }
    }
    public forEachTrailingCommentToEmit(end: number, cb: (commentPos: number, commentEnd: number, kind: SyntaxKind, hasTrailingNewLine: boolean) => void) {
        // Emit the trailing comments only if the container's end doesn't match because the container should take care of emitting these comments
        if (this.currentSourceFile && (this.containerEnd === -1 || (end !== this.containerEnd && end !== this.declarationListContainerEnd))) {
            forEachTrailingCommentRange(this.currentSourceFile.text, end, cb);
        }
    }
    public hasDetachedComments(pos: number) {
        return this.detachedCommentsInfo !== undefined && last(this.detachedCommentsInfo).nodePos === pos;
    }
    public forEachLeadingCommentWithoutDetachedComments(cb: (commentPos: number, commentEnd: number, kind: SyntaxKind, hasTrailingNewLine: boolean, rangePos: number) => void) {
        if (!this.currentSourceFile)
            return;
        // get the leading comments from detachedPos
        const pos = last(this.detachedCommentsInfo!).detachedCommentEndPos;
        if (this.detachedCommentsInfo!.length - 1) {
            (this.detachedCommentsInfo!.pop)();
        }
        else {
            this.detachedCommentsInfo = undefined;
        }
        forEachLeadingCommentRange(this.currentSourceFile.text, pos, cb, /*state*/ pos);
    }
    public emitDetachedCommentsAndUpdateCommentsInfo(range: TextRange) {
        const currentDetachedCommentInfo = this.currentSourceFile && emitDetachedComments(this.currentSourceFile.text, this.getCurrentLineMap(), this.writer, this.emitComment?.bind?.(this), range, this.newLine, this.commentsDisabled);
        if (currentDetachedCommentInfo) {
            if (this.detachedCommentsInfo) {
                (this.detachedCommentsInfo.push)(currentDetachedCommentInfo);
            }
            else {
                this.detachedCommentsInfo = [currentDetachedCommentInfo];
            }
        }
    }
    public emitComment(text: string, lineMap: readonly number[], writer: EmitTextWriter, commentPos: number, commentEnd: number, newLine: string) {
        if (!this.currentSourceFile || !this.shouldWriteComment(this.currentSourceFile.text, commentPos))
            return;
        this.emitPos(commentPos);
        writeCommentRange(text, lineMap, writer, commentPos, commentEnd, newLine);
        this.emitPos(commentEnd);
    }
    public isTripleSlashComment(commentPos: number, commentEnd: number) {
        return !!this.currentSourceFile && isRecognizedTripleSlashComment(this.currentSourceFile.text, commentPos, commentEnd);
    }
    public pipelineEmitWithSourceMaps(hint: EmitHint, node: Node) {
        const pipelinePhase = this.getNextPipelinePhase(PipelinePhase.SourceMaps, hint, node);
        this.emitSourceMapsBeforeNode(node);
        pipelinePhase(hint, node);
        this.emitSourceMapsAfterNode(node);
    }
    public emitSourceMapsBeforeNode(node: Node) {
        const emitFlags = getEmitFlags(node);
        const sourceMapRange = getSourceMapRange(node);
        // Emit leading sourcemap
        const source = sourceMapRange.source || this.sourceMapSource;
        if (node.kind !== SyntaxKind.NotEmittedStatement
            && (emitFlags & EmitFlags.NoLeadingSourceMap) === 0
            && sourceMapRange.pos >= 0) {
            this.emitSourcePos(sourceMapRange.source || this.sourceMapSource, this.skipSourceTrivia(source, sourceMapRange.pos));
        }
        if (emitFlags & EmitFlags.NoNestedSourceMaps) {
            this.sourceMapsDisabled = true;
        }
    }
    public emitSourceMapsAfterNode(node: Node) {
        const emitFlags = getEmitFlags(node);
        const sourceMapRange = getSourceMapRange(node);
        // Emit trailing sourcemap
        if (emitFlags & EmitFlags.NoNestedSourceMaps) {
            this.sourceMapsDisabled = false;
        }
        if (node.kind !== SyntaxKind.NotEmittedStatement
            && (emitFlags & EmitFlags.NoTrailingSourceMap) === 0
            && sourceMapRange.end >= 0) {
            this.emitSourcePos(sourceMapRange.source || this.sourceMapSource, sourceMapRange.end);
        }
    }
    public skipSourceTrivia(source: SourceMapSource, pos: number): number {
        return source.skipTrivia ? (source.skipTrivia)(pos) : skipTrivia(source.text, pos);
    }
    public emitPos(pos: number) {
        if (this.sourceMapsDisabled || positionIsSynthesized(pos) || this.isJsonSourceMapSource(this.sourceMapSource)) {
            return;
        }
        const { line: sourceLine, character: sourceCharacter } = getLineAndCharacterOfPosition(this.sourceMapSource, pos);
        (this.sourceMapGenerator!.addMapping)((this.writer.getLine)(), (this.writer.getColumn)(), this.sourceMapSourceIndex, sourceLine, sourceCharacter, 
        /*nameIndex*/ undefined);
    }
    public emitSourcePos(source: SourceMapSource, pos: number) {
        if (source !== this.sourceMapSource) {
            const savedSourceMapSource = this.sourceMapSource;
            const savedSourceMapSourceIndex = this.sourceMapSourceIndex;
            this.setSourceMapSource(source);
            this.emitPos(pos);
            this.resetSourceMapSource(savedSourceMapSource, savedSourceMapSourceIndex);
        }
        else {
            this.emitPos(pos);
        }
    }
    public emitTokenWithSourceMap(node: Node | undefined, token: SyntaxKind, writer: (s: string) => void, tokenPos: number, emitCallback: (token: SyntaxKind, writer: (s: string) => void, tokenStartPos: number) => number) {
        if (this.sourceMapsDisabled || node && isInJsonFile(node)) {
            return emitCallback(token, writer, tokenPos);
        }
        const emitNode = node && node.emitNode;
        const emitFlags = emitNode && emitNode.flags || EmitFlags.None;
        const range = emitNode && emitNode.tokenSourceMapRanges && (emitNode.tokenSourceMapRanges)[token];
        const source = range && range.source || this.sourceMapSource;
        tokenPos = this.skipSourceTrivia(source, range ? range.pos : tokenPos);
        if ((emitFlags & EmitFlags.NoTokenLeadingSourceMaps) === 0 && tokenPos >= 0) {
            this.emitSourcePos(source, tokenPos);
        }
        tokenPos = emitCallback(token, writer, tokenPos);
        if (range)
            tokenPos = range.end;
        if ((emitFlags & EmitFlags.NoTokenTrailingSourceMaps) === 0 && tokenPos >= 0) {
            this.emitSourcePos(source, tokenPos);
        }
        return tokenPos;
    }
    public setSourceMapSource(source: SourceMapSource) {
        if (this.sourceMapsDisabled) {
            return;
        }
        this.sourceMapSource = source;
        if (source === this.mostRecentlyAddedSourceMapSource) {
            // Fast path for when the new source map is the most recently added, in which case
            // we use its captured index without going through the source map generator.
            this.sourceMapSourceIndex = this.mostRecentlyAddedSourceMapSourceIndex;
            return;
        }
        if (this.isJsonSourceMapSource(source)) {
            return;
        }
        this.sourceMapSourceIndex = (this.sourceMapGenerator!.addSource)(source.fileName);
        if (this.printerOptions.inlineSources) {
            (this.sourceMapGenerator!.setSourceContent)(this.sourceMapSourceIndex, source.text);
        }
        this.mostRecentlyAddedSourceMapSource = source;
        this.mostRecentlyAddedSourceMapSourceIndex = this.sourceMapSourceIndex;
    }
    public resetSourceMapSource(source: SourceMapSource, sourceIndex: number) {
        this.sourceMapSource = source;
        this.sourceMapSourceIndex = sourceIndex;
    }
    public isJsonSourceMapSource(sourceFile: SourceMapSource) {
        return fileExtensionIs(sourceFile.fileName, Extension.Json);
    }
}
function createBracketsMap() {
    const brackets: string[][] = [];
    brackets[ListFormat.Braces] = ["{", "}"];
    brackets[ListFormat.Parenthesis] = ["(", ")"];
    brackets[ListFormat.AngleBrackets] = ["<", ">"];
    brackets[ListFormat.SquareBrackets] = ["[", "]"];
    return brackets;
}
function getOpeningBracket(format: ListFormat) {
    return brackets[format & ListFormat.BracketsMask][0];
}
function getClosingBracket(format: ListFormat) {
    return brackets[format & ListFormat.BracketsMask][1];
}
// Flags enum to track count of temp variables and a few dedicated names
const enum TempFlags {
    Auto = 0x00000000,// No preferred name
    CountMask = 0x0FFFFFFF,// Temp variable counter
    _i = 0x10000000
}
interface OrdinalParentheizerRuleSelector<T extends Node> {
    select(index: number): ((node: T) => T) | undefined;
}
type ParenthesizerRule<T extends Node> = (node: T) => T;
type ParenthesizerRuleOrSelector<T extends Node> = OrdinalParentheizerRuleSelector<T> | ParenthesizerRule<T>;
type EmitFunction = <T extends Node>(node: T, parenthesizerRule?: ParenthesizerRule<T>) => void;
type EmitListItemFunction<T extends Node> = (node: Node, emit: EmitFunction, parenthesizerRule: ParenthesizerRuleOrSelector<T> | undefined, index: number) => void;
function emitListItemNoParenthesizer(node: Node, emit: EmitFunction, _parenthesizerRule: ParenthesizerRuleOrSelector<Node> | undefined, _index: number) {
    emit(node);
}
function emitListItemWithParenthesizerRuleSelector(node: Node, emit: EmitFunction, parenthesizerRuleSelector: OrdinalParentheizerRuleSelector<Node> | undefined, index: number) {
    emit(node, parenthesizerRuleSelector!.select(index));
}
function emitListItemWithParenthesizerRule(node: Node, emit: EmitFunction, parenthesizerRule: ParenthesizerRule<Node> | undefined, _index: number) {
    emit(node, parenthesizerRule);
}
function getEmitListItem<T extends Node>(emit: EmitFunction, parenthesizerRule: ParenthesizerRuleOrSelector<T> | undefined): EmitListItemFunction<T> {
    return emit.length === 1 ? emitListItemNoParenthesizer as EmitListItemFunction<T> :
        typeof parenthesizerRule === "object" ? emitListItemWithParenthesizerRuleSelector as EmitListItemFunction<T> :
            emitListItemWithParenthesizerRule as EmitListItemFunction<T>;
}
