/* Copyright 2026 Miguel Ferreira Mazetto
*
*  Licensed under the Apache License, Version 2.0 (the "License");
*  you may not use this file except in compliance with the License.
*  You may obtain a copy of the License at
*
*      http://www.apache.org/licenses/LICENSE-2.0
*
*  Unless required by applicable law or agreed to in writing, software
*  distributed under the License is distributed on an "AS IS" BASIS,
*  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
*  See the License for the specific language governing permissions and
*  limitations under the License.
*/
import { Extension, fileExtensionIsOneOf, getSourceFilePathInNewDir, removeFileExtension, type CompilerOptions, type EmitHost, type EmitResolver, type TypeChecker, fileExtensionIs, JsxEmit } from 'typescript'

export type EmitterExtraContext = {
    typeChecker?: TypeChecker
    compilerOptions?: CompilerOptions
    resolver?: EmitResolver
    host?: EmitHost
}

//export function dealDeclarationExt(options: CompilerOptions, ext: ReturnType<typeof getDeclarationEmitExtensionForPath>){
//    if(ext === Extension.Dts && options.declarationOutputExtension){
//        ext = options.declarationOutputExtension as Extension.Dts
//    }
//    return ext
//}

function typoly_getDeclarationEmitExtensionForPath(options: CompilerOptions, path: string): Extension.Dts | Extension.Dmts | Extension.Dcts | ".d.json.ts" {
    return fileExtensionIsOneOf(path, [Extension.Mjs, Extension.Mts]) ? Extension.Dmts :
        fileExtensionIsOneOf(path, [Extension.Cjs, Extension.Cts]) ? Extension.Dcts :
        fileExtensionIsOneOf(path, [Extension.Json]) ? `.d.json.ts` :
        options.declarationOutputExtension as Extension.Dts;
}

export function typoly_getDeclarationEmitOutputFilePath(fileName: string, host: EmitHost){
    const options = host.getCompilerOptions()
    const outputDir = options.declarationDir || options.outDir; // Prefer declaration folder if specified

    getSourceFilePathInNewDir(fileName, host, outputDir!)

    const path = outputDir
        ? getSourceFilePathInNewDir(fileName, host, outputDir!)
        : fileName;
    const declarationExtension = typoly_getDeclarationEmitExtensionForPath(options, path);
    return removeFileExtension(path) + declarationExtension;
}

export function typoly_getOutputExtension(fileName: string, options: CompilerOptions): Extension {
    return fileExtensionIs(fileName, Extension.Json) ? Extension.Json :
        options.jsx === JsxEmit.Preserve && fileExtensionIsOneOf(fileName, [Extension.Jsx, Extension.Tsx]) ? Extension.Jsx :
            fileExtensionIsOneOf(fileName, [Extension.Mts, Extension.Mjs]) ? Extension.Mjs :
                fileExtensionIsOneOf(fileName, [Extension.Cts, Extension.Cjs]) ? Extension.Cjs :
                    ((options.outputExtension ?? Extension.Js) as Extension)
}
