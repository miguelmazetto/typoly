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
