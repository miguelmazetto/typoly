import * as ts from 'typescript'
import { CppPrinter } from './out_languages/cpp/printer'
import { GoPrinter } from './out_languages/go/printer'
import { RawTypescriptPrinter, emitFiles } from './out_languages/common/ts_printer'
import { chdir, exit } from 'process'
import { join, resolve, dirname, basename, relative } from 'path'
import * as fs from 'fs'
import type { EmitterExtraContext } from './out_languages/common/emitter_extra'

// Parse command line arguments
interface CliArgs {
    lang: 'cpp' | 'go';
    outDir: string;
    entryFile: string;
    help: boolean;
    watch: boolean;
}

interface PackageJson {
    name: string;
    main?: string;
    version?: string;
}

function parseArgs(): CliArgs {
    const args = process.argv.slice(2);
    const result: CliArgs = {
        lang: 'cpp',
        outDir: '.typoly_built',
        entryFile: '',
        help: false,
        watch: false
    };
    
    for (let i = 0; i < args.length; i++) {
        const arg = args[i];
        switch (arg) {
            case '--lang':
            case '-l':
                const lang = args[++i]?.toLowerCase();
                if (lang === 'cpp' || lang === 'go') {
                    result.lang = lang;
                } else {
                    console.error(`Unknown language: ${lang}. Supported: cpp, go`);
                    exit(1);
                }
                break;
            case '--out':
            case '-o':
                result.outDir = args[++i] || '.typoly_built';
                break;
            case '--file':
            case '-f':
                result.entryFile = args[++i] || '';
                break;
            case '--help':
            case '-h':
                result.help = true;
                break;
            case '--watch':
            case '-w':
                result.watch = true;
                break;
            default:
                if (!arg.startsWith('-')) {
                    result.entryFile = arg;
                }
        }
    }
    
    return result;
}

function printHelp() {
    console.log(`
 Typoly - TypeScript to other languages transpiler

 Usage: bun run index.ts [options] [entry-file]

 Options:
   --lang, -l <lang>     Target language (cpp, go) [default: cpp]
   --out, -o <dir>       Output directory [default: .typoly_built]
   --file, -f <file>     Entry file [default: from package.json main]
   --watch, -w           Watch mode - recompile on file changes
   --help, -h            Show this help message

 Examples:
   bun run index.ts                          # Transpile to C++
   bun run index.ts --lang go                # Transpile to Go
   bun run index.ts -l go -o build           # Transpile to Go in build/ directory
   bun run index.ts --file src/main.ts       # Transpile src/main.ts to C++
   bun run index.ts --watch                  # Watch mode for incremental compilation
 `);
}

function sanitizeIdentifier(name: string): string {
    let sanitized = name.replace(/[^a-zA-Z0-9_]/g, '_');
    if (/^[0-9]/.test(sanitized)) {
        sanitized = '_' + sanitized;
    }
    sanitized = sanitized.replace(/_+/g, '_');
    sanitized = sanitized.replace(/_+$/, '');
    return sanitized;
}

function generateBuildFiles(
    args: CliArgs,
    cwd: string,
    outLangDir: string,
    generatedFiles: string[],
    generatedModules: string[],
    mainModuleName: string,
    packageName: string,
    goModuleName: string,
    pkg: PackageJson,
    stdlibDir: string,
    stdlibOutDir: string
) {
    if (args.lang === 'cpp') {
        if (!fs.existsSync(stdlibOutDir)) {
            fs.mkdirSync(stdlibOutDir, { recursive: true });
        }
        
        if (fs.existsSync(stdlibDir)) {
            const stdlibFiles = fs.readdirSync(stdlibDir).filter(f => f.endsWith('.mxx') || f.endsWith('.h') || f.endsWith('.hpp') || f.endsWith('.cpp'));
            for (const file of stdlibFiles) {
                const srcPath = join(stdlibDir, file);
                const destPath = join(stdlibOutDir, file);
                fs.copyFileSync(srcPath, destPath);
                console.log('copied stdlib:', file);
            }
        }
        
        const macrosSrc = join(stdlibDir, 'typoly_macros.h');
        const macrosDest = join(outLangDir, 'typoly_macros.h');
        if (fs.existsSync(macrosSrc)) {
            fs.copyFileSync(macrosSrc, macrosDest);
            console.log('copied: typoly_macros.h');
        }
        
        const stdlibAbsolutePath = join(__dirname, 'out_languages', 'cpp', 'stdlib').replace(/\\/g, '/');
        const cmakeContent = generateCMakeLists(packageName, generatedFiles, stdlibAbsolutePath);
        const cmakePath = join(outLangDir, 'CMakeLists.txt');
        fs.writeFileSync(cmakePath, cmakeContent);
        console.log('wrote', cmakePath);
        
        const buildScriptContent = generateCppBuildScript(mainModuleName, generatedFiles, stdlibOutDir);
        const buildScriptPath = join(outLangDir, 'build.bat');
        fs.writeFileSync(buildScriptPath, buildScriptContent);
        console.log('wrote', buildScriptPath);
        
        const mainCppContent = `// Typoly AI Generated Entry Point
// This file provides the main() function for MSVC

#include <iostream>
import ${mainModuleName};
import typoly_std_builtin;

int main(int argc, char* argv[]) {
    typoly_std_builtin::initArgv(argc, argv);
    ${mainModuleName}::__tld();
    return 0;
}
`;
        const mainCppPath = join(outLangDir, 'main.cpp');
        fs.writeFileSync(mainCppPath, mainCppContent);
        console.log('wrote', mainCppPath);
    } else if (args.lang === 'go') {
        if (!fs.existsSync(stdlibOutDir)) {
            fs.mkdirSync(stdlibOutDir, { recursive: true });
        }
        
        function copyDirRecursive(src: string, dest: string) {
            if (!fs.existsSync(dest)) {
                fs.mkdirSync(dest, { recursive: true });
            }
            const entries = fs.readdirSync(src, { withFileTypes: true });
            for (const entry of entries) {
                const srcPath = join(src, entry.name);
                const destPath = join(dest, entry.name);
                if (entry.isDirectory()) {
                    copyDirRecursive(srcPath, destPath);
                } else {
                    fs.copyFileSync(srcPath, destPath);
                }
            }
        }
        
        if (fs.existsSync(stdlibDir)) {
            copyDirRecursive(stdlibDir, stdlibOutDir);
            console.log('copied Go stdlib');
        }
        
        const goModContent = generateGoMod(goModuleName, pkg);
        const goModPath = join(outLangDir, 'go.mod');
        fs.writeFileSync(goModPath, goModContent);
        console.log('wrote', goModPath);
        
        const entryFileForModule = args.entryFile.replace(/\\/g, '/');
        const mainPackagePath = entryFileForModule.replace(/\.tsx?$/, '');
        const mainGoImportPath = mainPackagePath.startsWith(goModuleName + '/') 
            ? mainPackagePath 
            : goModuleName + '/' + mainPackagePath;
        const mainGoContent = generateGoMain(mainGoImportPath, generatedModules);
        const mainGoPath = join(outLangDir, 'main.go');
        fs.writeFileSync(mainGoPath, mainGoContent);
        console.log('wrote', mainGoPath);
    }
}

interface WatchState {
    generatedFiles: string[];
    generatedModules: string[];
    mainModuleName: string;
}

function runWatchMode(
    args: CliArgs,
    cwd: string,
    entryFile: string,
    outLangDir: string,
    goModuleName: string,
    PrinterClass: typeof RawTypescriptPrinter,
    fileExtension: string,
    declExtension: string,
    packageName: string,
    pkg: PackageJson
) {
    const watchState: WatchState = {
        generatedFiles: [],
        generatedModules: [],
        mainModuleName: ''
    };

    const compilerOptions: ts.CompilerOptions = {
        noLib: false,
        noResolve: false,
        declaration: false,
        declarationOutputExtension: declExtension,
        outputExtension: fileExtension,
        rootDir: cwd,
        outDir: outLangDir
    };

    const stdlibDir = join(__dirname, 'out_languages', args.lang, 'stdlib');
    const stdlibOutDir = join(outLangDir, 'stdlib');

    console.log('Starting watch mode...');
    console.log(`Watching: ${entryFile} and all dependencies`);

    function emitSourceFiles(program: ts.Program) {
        const tc = program.getTypeChecker();
        const emitresolver = tc.getEmitResolver();
        
        watchState.generatedFiles = [];
        watchState.generatedModules = [];
        
        for (const sourceFile of program.getSourceFiles()) {
            if (sourceFile.isDeclarationFile) continue;
            
            const relPath = relative(cwd, sourceFile.fileName).replace(/\\/g, '/').replace(/\.tsx?$/, '');
            const moduleName = relPath.split('/').filter(p => p && p !== '.').join('__');
            
            const sfFileName = sourceFile.fileName.replace(/\\/g, '/');
            const entryFileNormalized = entryFile.replace(/\\/g, '/');
            if (sfFileName === entryFileNormalized || sfFileName.endsWith('/' + entryFileNormalized)) {
                watchState.mainModuleName = moduleName;
            }
            
            const emitHost: ts.EmitHost = {
                getCanonicalFileName: program.getCanonicalFileName,
                getCommonSourceDirectory: program.getCommonSourceDirectory,
                getCompilerOptions: program.getCompilerOptions,
                getCurrentDirectory: () => program.getCurrentDirectory(),
                getSourceFile: program.getSourceFile,
                getSourceFileByPath: program.getSourceFileByPath,
                getSourceFiles: program.getSourceFiles,
                isSourceFileFromExternalLibrary: program.isSourceFileFromExternalLibrary,
                getRedirectFromSourceFile: program.getRedirectFromSourceFile,
                isSourceOfProjectReferenceRedirect: program.isSourceOfProjectReferenceRedirect,
                getSymlinkCache: program.getSymlinkCache,
                writeFile: (f, text) => {
                    if (f.endsWith('.d.ts')) {
                        f = f.substring(0, f.length - '.d.ts'.length) + declExtension;
                    }
                    if (f.endsWith('.ts') && !f.endsWith('.d.ts')) {
                        f = f.substring(0, f.length - '.ts'.length) + fileExtension;
                    }
                    
                    f = f.replace(/\\/g, '/');
                    
                    let outPath = f;
                    
                    if (args.lang === 'go') {
                        const goModulePrefix = goModuleName + '/';
                        if (outPath.includes(goModulePrefix)) {
                            outPath = outPath.replace(goModulePrefix, '');
                        }
                        
                        const lastSlash = outPath.lastIndexOf('/');
                        if (lastSlash > 0) {
                            const dir = outPath.substring(0, lastSlash);
                            const base = outPath.substring(lastSlash + 1);
                            const pkgName = base.replace(/\.(go|ts)$/, '');
                            outPath = `${dir}/${pkgName}/${base}`;
                        }
                    }
                    
                    const lastSlash = outPath.lastIndexOf('/');
                    const outDirPath = lastSlash > 0 ? outPath.substring(0, lastSlash) : '';
                    if (outDirPath && !fs.existsSync(outDirPath)) {
                        fs.mkdirSync(outDirPath, { recursive: true });
                    }
                    
                    fs.writeFileSync(outPath, text);
                    console.log('wrote', outPath);
                    
                    const relPath = relative(outLangDir, outPath).replace(/\\/g, '/');
                    if (!watchState.generatedFiles.includes(relPath)) {
                        watchState.generatedFiles.push(relPath);
                        watchState.generatedModules.push(moduleName);
                    }
                },
                isEmitBlocked: () => false,
                shouldTransformImportCall: program.shouldTransformImportCall,
                getEmitModuleFormatOfFile: program.getEmitModuleFormatOfFile,
                getDefaultResolutionModeForFile: program.getDefaultResolutionModeForFile,
                getModeForResolutionAtIndex: program.getModeForResolutionAtIndex,
                readFile: program.readFile,
                fileExists: program.fileExists,
                realpath: program.realpath,
                useCaseSensitiveFileNames: program.useCaseSensitiveFileNames,
                getBuildInfo: program.getBuildInfo!,
                getSourceFileFromReference: program.getSourceFileFromReference,
                redirectTargetsMap: program.redirectTargetsMap,
                getFileIncludeReasons: program.getFileIncludeReasons,
                createHash: ts.sys.createHash,
                getModuleResolutionCache: program.getModuleResolutionCache,
                trace: program.trace,
                getGlobalTypingsCacheLocation: program.getGlobalTypingsCacheLocation,
            };
            
            emitFiles(
                emitresolver,
                emitHost,
                sourceFile,
                {
                    declarationTransformers: [ts.transformDeclarations],
                    scriptTransformers: []
                },
                false,
                false,
                false,
                false,
                makeCreatePrinter(PrinterClass),
                tc
            );
        }
    }

    const watchHost = ts.createWatchCompilerHost(
        [entryFile],
        compilerOptions,
        ts.sys,
        undefined,
        undefined,
        (diagnostic, newLine, options, errorCount) => {
            const msg = ts.flattenDiagnosticMessageText(diagnostic.messageText, newLine);
            if (errorCount !== undefined && errorCount > 0) {
                console.error(`[${newLine === '\n' ? 'error' : 'info'}] ${msg}`);
            } else {
                console.log(`[${newLine === '\n' ? 'info' : 'info'}] ${msg}`);
            }
        }
    );

    watchHost.afterProgramCreate = (builderProgram) => {
        const program = builderProgram.getProgram();
        emitSourceFiles(program);
        
        console.log('\n=== Build Summary ===');
        console.log(`Language: ${args.lang}`);
        console.log(`Package: ${pkg.name}`);
        console.log(`Entry: ${entryFile}`);
        console.log(`Main module: ${watchState.mainModuleName}`);
        console.log(`Generated files: ${watchState.generatedFiles.length}`);
        console.log(`Output: ${outLangDir}`);
    };

    const watchProgram = ts.createWatchProgram(watchHost);
    
    return watchProgram;
}

function readPackageJson(cwd: string): PackageJson {
    const pkgPath = join(cwd, 'package.json');
    try {
        const content = fs.readFileSync(pkgPath, 'utf-8');
        const pkg = JSON.parse(content);
        return {
            name: pkg.name || 'typoly_project',
            main: pkg.main,
            version: pkg.version || '1.0.0'
        };
    } catch {
        return { name: 'typoly_project', main: 'index.ts', version: '1.0.0' };
    }
}

function benchmark_func<T>(func: () => T): T{
    let before = performance.now()
    let r = func()
    let after = performance.now()
    console.log(`[${func.name || 'anonymous'}] took ${(after-before).toFixed(2)}ms`)
    return r
}

function makeCreatePrinter(v: typeof RawTypescriptPrinter){
    return (extra: EmitterExtraContext, printerOptions: ts.PrinterOptions = {}, handlers: ts.PrintHandlers = {}): ts.Printer => {
        return new v(printerOptions, handlers, extra)
    }
}

// Generate CMakeLists.txt for C++
function generateCMakeLists(projectName: string, sourceFiles: string[], stdlibPath: string): string {
    const sanitizedName = sanitizeIdentifier(projectName);
    
    let cmake = `cmake_minimum_required(VERSION 3.28)
project(${sanitizedName} LANGUAGES CXX)

set(CMAKE_CXX_STANDARD 20)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

# Typoly Generated Build File
# Package: ${projectName}

# Add stdlib as subdirectory
add_subdirectory(${stdlibPath} \${CMAKE_CURRENT_BINARY_DIR}/stdlib)

# Include directory for macros
include_directories(\${CMAKE_CURRENT_SOURCE_DIR})

# Module source files
set(MODULE_SOURCES
`;

    for (const file of sourceFiles) {
        cmake += `    "${file}"\n`;
    }
    
    cmake += `)

# Main entry point (separate file for MSVC compatibility)
set(MAIN_SOURCE main.cpp)

# Create executable from module sources and main
add_executable(\${PROJECT_NAME} \${MODULE_SOURCES} \${MAIN_SOURCE})

# Set module sources with CXX_MODULES file set
target_sources(\${PROJECT_NAME}
    PRIVATE
    FILE_SET CXX_MODULES FILES
        \${MODULE_SOURCES}
)

# Include directory for typoly_macros.h
target_include_directories(\${PROJECT_NAME} PRIVATE \${CMAKE_CURRENT_SOURCE_DIR})

# Link the stdlib
target_link_libraries(\${PROJECT_NAME} PRIVATE typoly_stdlib)

# Compiler options
if(MSVC)
    target_compile_options(\${PROJECT_NAME} PRIVATE /W4 /EHsc)
else()
    target_compile_options(\${PROJECT_NAME} PRIVATE -Wall -Wextra)
endif()

# Build type
if(NOT CMAKE_BUILD_TYPE)
    set(CMAKE_BUILD_TYPE Debug)
endif()

message(STATUS "Typoly Build Configuration:")
message(STATUS "  Project: ${sanitizedName}")
message(STATUS "  Module sources: \${MODULE_SOURCES}")
message(STATUS "  C++ Standard: C++20")
message(STATUS "  Generator: \${CMAKE_GENERATOR}")
`;

    return cmake;
}

// Generate C++ main.cpp entry point
function generateCppMain(mainModuleName: string, allModules: string[]): string {
    let mainCpp = `// Typoly Generated Entry Point
#include <iostream>

// Import all modules
`;
    
    for (const mod of allModules) {
        mainCpp += `import ${mod};\n`;
    }
    
    mainCpp += `
// Main function - entry point
int main() {
    std::cout << "Typoly: Starting application..." << std::endl;
    
    // Initialize top-level declarations for main module
`;
    
    // Only call TLD for the main module (which will import and init others as needed)
    mainCpp += `    if (!${mainModuleName}::__tld_initialized) {
        ${mainModuleName}::__tld();
        ${mainModuleName}::__tld_initialized = true;
    }
    
    std::cout << "Typoly: Application finished." << std::endl;
    return 0;
}
`;
    return mainCpp;
}

// Generate C++ build script for clang with modules support
function generateCppBuildScript(mainModuleName: string, sourceFiles: string[], stdlibDir: string): string {
    let script = `@echo off
REM Typoly Generated Build Script
REM Uses clang++ with C++20 modules support

echo Building with clang++ and C++20 modules...

REM First, compile the stdlib modules
echo Compiling stdlib modules...
`;

    // Add stdlib compilation commands
    script += `
REM Compile stdlib modules
clang++ -std=c++20 -fmodules -x c++ -c stdlib/builtin_basic_types.mxx -o stdlib/builtin_basic_types.pcm 2>NUL || echo Note: builtin_basic_types module may already exist
clang++ -std=c++20 -fmodules -x c++ -c stdlib/console.mxx -o stdlib/console.pcm 2>NUL || echo Note: console module may already exist
clang++ -std=c++20 -fmodules -x c++ -c stdlib/math.mxx -o stdlib/math.pcm 2>NUL || echo Note: math module may already exist
clang++ -std=c++20 -fmodules -x c++ -c stdlib/builtin.mxx -o stdlib/builtin.pcm 2>NUL || echo Note: builtin module may already exist
`;

    // Add source file compilation
    script += `
REM Compile user modules
`;
    
    for (const file of sourceFiles) {
        script += `clang++ -std=c++20 -fmodules -c "${file}" -o "${file}.o"\n`;
    }
    
    // Link
    script += `
REM Link everything together
clang++ -std=c++20 -fmodules `;
    
    for (const file of sourceFiles) {
        script += `"${file}.o" `;
    }
    script += `main.cpp -o ${sanitizeIdentifier(mainModuleName)}.exe

echo Build complete!
`;

    return script;
}

// Generate go.mod for Go
function generateGoMod(moduleName: string, pkg: PackageJson): string {
    return `module ${moduleName}

go 1.21

require (
)
`;
}

// Generate Go main wrapper
function generateGoMain(mainPackagePath: string, allPackages: string[]): string {
    let mainGo = `// Typoly Generated Entry Point
package main

import (
    "fmt"
`;
    
    // Add import for main package
    mainGo += `    "${mainPackagePath}"
`;
    
    mainGo += `)

func main() {
    fmt.Println("Typoly: Starting application...")
    
    // Initialize top-level declarations for main package
    if !${basename(mainPackagePath)}.TldInitialized {
        ${basename(mainPackagePath)}.Tld()
        ${basename(mainPackagePath)}.TldInitialized = true
    }
    
    fmt.Println("Typoly: Application finished.")
}
`;
    return mainGo;
}

// Main execution
const args = parseArgs();

if (args.help) {
    printHelp();
    exit(0);
}

// Get current working directory
const cwd = process.cwd();
console.log(`Working directory: ${cwd}`);

// Read package.json
const pkg = readPackageJson(cwd);
const packageName = sanitizeIdentifier(pkg.name);
console.log(`Package name: ${packageName}`);

// Determine entry file
let entryFile = args.entryFile || pkg.main || 'index.ts';
if (!entryFile.endsWith('.ts') && !entryFile.endsWith('.tsx')) {
    entryFile += '.ts';
}
console.log(`Entry file: ${entryFile}`);

// Determine Go module name from entry file path
const entryFileForModule = entryFile.replace(/\\/g, '/');
const goModuleName = entryFileForModule.startsWith('test_package/') ? 'test_package' : packageName;

// Create output directory structure
const outBaseDir = resolve(cwd, args.outDir);
const outLangDir = join(outBaseDir, args.lang);
if (!fs.existsSync(outLangDir)) {
    fs.mkdirSync(outLangDir, { recursive: true });
}
console.log(`Output directory: ${outLangDir}`);

// Select printer based on language
let PrinterClass: typeof RawTypescriptPrinter;
let fileExtension: string;
let declExtension: string;

switch (args.lang) {
    case 'cpp':
        PrinterClass = CppPrinter;
        fileExtension = '.cpp';
        declExtension = '.hpp';
        break;
    case 'go':
        PrinterClass = GoPrinter;
        fileExtension = '.go';
        declExtension = '.go';
        break;
    default:
        console.error(`Unsupported language: ${args.lang}`);
        exit(1);
}

const stdlibDir = join(__dirname, 'out_languages', args.lang, 'stdlib');
const stdlibOutDir = join(outLangDir, 'stdlib');

if (args.watch) {
    runWatchMode(
        args,
        cwd,
        entryFile,
        outLangDir,
        goModuleName,
        PrinterClass,
        fileExtension,
        declExtension,
        packageName,
        pkg
    );
} else {
    // Track generated files and modules
    const generatedFiles: string[] = [];
    const generatedModules: string[] = [];
    let mainModuleName = '';

    const program = benchmark_func(()=>ts.createProgram([entryFile], {
        noLib: false,
        noResolve: false,
        declaration: false,
        declarationOutputExtension: declExtension,
        outputExtension: fileExtension,
        rootDir: cwd,
        outDir: outLangDir
    }));

    const tc = program.getTypeChecker()

    function getEmitHost(writeFileCallback?: ts.WriteFileCallback): ts.EmitHost {
        return {
            getCanonicalFileName: program.getCanonicalFileName,
            getCommonSourceDirectory: program.getCommonSourceDirectory,
            getCompilerOptions: program.getCompilerOptions,
            getCurrentDirectory: () => program.getCurrentDirectory(),
            getSourceFile: program.getSourceFile,
            getSourceFileByPath: program.getSourceFileByPath,
            getSourceFiles: program.getSourceFiles,
            isSourceFileFromExternalLibrary: program.isSourceFileFromExternalLibrary,
            getRedirectFromSourceFile: program.getRedirectFromSourceFile,
            isSourceOfProjectReferenceRedirect: program.isSourceOfProjectReferenceRedirect,
            getSymlinkCache: program.getSymlinkCache,
            writeFile: writeFileCallback || program.writeFile,
            isEmitBlocked: (f)=>false,
            shouldTransformImportCall: program.shouldTransformImportCall,
            getEmitModuleFormatOfFile: program.getEmitModuleFormatOfFile,
            getDefaultResolutionModeForFile: program.getDefaultResolutionModeForFile,
            getModeForResolutionAtIndex: program.getModeForResolutionAtIndex,
            readFile: program.readFile,
            fileExists: program.fileExists,
            realpath: program.realpath,
            useCaseSensitiveFileNames: program.useCaseSensitiveFileNames,
            getBuildInfo: program.getBuildInfo!,
            getSourceFileFromReference: program.getSourceFileFromReference,
            redirectTargetsMap: program.redirectTargetsMap,
            getFileIncludeReasons: program.getFileIncludeReasons,
            createHash: ts.sys.createHash,
            getModuleResolutionCache: program.getModuleResolutionCache,
            trace: program.trace,
            getGlobalTypingsCacheLocation: program.getGlobalTypingsCacheLocation,
        };
    }

    console.log('Source files:', program.getSourceFiles()
        .filter(f => !f.isDeclarationFile)
        .map(f => f.fileName.replace(cwd.replace(/\\/g, '/') + '/', '')));

    {
        let emitresolver = tc.getEmitResolver()

        for (const sourceFile of program.getSourceFiles()) {
            if (sourceFile.isDeclarationFile) continue;
            
            // Compute module name (same logic as printer's computeModuleName)
            const relPath = relative(cwd, sourceFile.fileName).replace(/\\/g, '/').replace(/\.tsx?$/, '');
            const moduleName = relPath.split('/').filter(p => p && p !== '.').join('__');
            
            // Track if this is the main entry file
            const sfFileName = sourceFile.fileName.replace(/\\/g, '/');
            const entryFileNormalized = entryFile.replace(/\\/g, '/');
            if (sfFileName === entryFileNormalized || sfFileName.endsWith('/' + entryFileNormalized)) {
                mainModuleName = moduleName;
            }
            
            const emitResults = emitFiles(
                emitresolver,
                getEmitHost((f, text, wo, onerr, files, d) => {
                    // Handle file extension conversion
                    if (f.endsWith('.d.ts')) {
                        f = f.substring(0, f.length - '.d.ts'.length) + declExtension;
                    }
                    if (f.endsWith('.ts') && !f.endsWith('.d.ts')) {
                        f = f.substring(0, f.length - '.ts'.length) + fileExtension;
                    }
                    
                    // Normalize path
                    f = f.replace(/\\/g, '/');
                    const cwdNormalized = cwd.replace(/\\/g, '/');
                    const outDirNormalized = outLangDir.replace(/\\/g, '/');
                    
                    // The path from TypeScript already includes outDir, so just use it directly
                    let outPath = f;
                    
                    // For Go, restructure output so each file is in its own package directory
                    if (args.lang === 'go') {
                        // Strip the Go module name prefix from the path (e.g., test_package/...)
                        // since go.mod already declares the module as that prefix
                        const goModulePrefix = goModuleName + '/';
                        if (outPath.includes(goModulePrefix)) {
                            outPath = outPath.replace(goModulePrefix, '');
                        }
                        
                        // Convert path/to/file.go to path/to/file/file.go
                        const lastSlash = outPath.lastIndexOf('/');
                        if (lastSlash > 0) {
                            const dir = outPath.substring(0, lastSlash);
                            const base = outPath.substring(lastSlash + 1);
                            const pkgName = base.replace(/\.(go|ts)$/, '');
                            outPath = `${dir}/${pkgName}/${base}`;
                        }
                    }
                    
                    const lastSlash = outPath.lastIndexOf('/');
                    const outDirPath = lastSlash > 0 ? outPath.substring(0, lastSlash) : '';
                    if (outDirPath && !fs.existsSync(outDirPath)) {
                        fs.mkdirSync(outDirPath, { recursive: true });
                    }
                    
                    fs.writeFileSync(outPath, text);
                    console.log('wrote', outPath);
                    
                    // Track relative file path for build files (relative to outLangDir)
                    const relPath = relative(outLangDir, outPath).replace(/\\/g, '/');
                    generatedFiles.push(relPath);
                    generatedModules.push(moduleName);
                }),
                sourceFile,
                {
                    declarationTransformers: [ts.transformDeclarations],
                    scriptTransformers: []
                },
                /*emitOnly*/ false,
                /*onlyBuildInfo*/ false,
                /*forceDtsEmit*/ false,
                /*skipBuildInfo*/ false,
                makeCreatePrinter(PrinterClass),
                tc
            )
        }
    }

    // Generate build system files
    generateBuildFiles(
        args,
        cwd,
        outLangDir,
        generatedFiles,
        generatedModules,
        mainModuleName,
        packageName,
        goModuleName,
        pkg,
        stdlibDir,
        stdlibOutDir
    );

    console.log('\n=== Build Summary ===');
    console.log(`Language: ${args.lang}`);
    console.log(`Package: ${pkg.name}`);
    console.log(`Entry: ${entryFile}`);
    console.log(`Main module: ${mainModuleName}`);
    console.log(`Generated files: ${generatedFiles.length}`);
    console.log(`Output: ${outLangDir}`);
    console.log('Done!');
}
