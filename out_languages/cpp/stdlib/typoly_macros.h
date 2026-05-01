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
// Typoly Macros for C++20 Modules
// These macros help manage top-level declarations and module initialization

#pragma once

// Define imported module TLD calls
#define __IMPORT_TLD_BLOCK(...) \
    void __imported_modules_tld() { __VA_ARGS__; }

// Empty import block for modules with no imports  
#define __IMPORT_TLD_BLOCK_EMPTY() \
    inline void __imported_modules_tld() {}

// Call a single imported module's __tld()
#define __IMPORT_TLD(modulename) modulename::__tld()

// TLD helper macros - emit these separately
#define __TLD_INITIALIZED bool __tld_initialized = false
#define __TLD_INIT() if (__tld_initialized) return; __tld_initialized = true; __imported_modules_tld()
