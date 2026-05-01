<style>
  html, body {
    background-color: #121314;
    color: #BBBEBF;
  }
</style>
# TyPoly

## Why This Project?

### The Problem with JavaScript/TypeScript Runtime

TypeScript offers excellent developer experience with static typing, autocompletion, and compile-time error catching. However, at runtime, JavaScript has significant resource consumption issues that affect many use cases:

#### 1. Memory Consumption

JavaScript objects are **type-flexible by design**. Each value must be able to hold any type at runtime because types are discarded after compilation:

```javascript
// TypeScript (compile time)
let x: string | number = "hello";
x = 42;  // Works at runtime

// At runtime, x must be able to hold BOTH string AND number
// This requires metadata for dynamic typing (hidden classes, type tags)
// V8 uses hidden classes: each object tracks its shape
// Every number needs extra memory for potential type changes
```

JavaScript engines (V8, JavaScriptCore) implement sophisticated optimizations, but they still need to handle type flexibility. A simple counter `for (let i = 0; i < 1000000; i++)` creates a number that could theoretically become any type.

#### 2. Binary/Bundle Size

Even with minification, JavaScript bundles are large because:
- All type information is removed
- Runtime helpers must be included
- No dead code elimination at runtime
- A 10MB TypeScript project can easily become 500KB+ of JavaScript

#### 3. Cold-Boot Time

When a JavaScript application starts:
1. **Parse** source into AST
2. **Compile** to bytecode (ignition)
3. **Optimize** hot paths (turbofan)
4. **Run** code

This "warm-up" phase (Tier-Up, crankshafting) takes seconds for large applications. There's no Ahead-of-Time (AOT) compilation - every startup repeats this process.

#### 4. Embedded Hardware

For microcontroller or lightweight device programming:
- JavaScript engines require significant RAM (V8: ~50MB minimum)
- Garbage collection pauses are unacceptable for real-time systems
- No deterministic execution

#### 5. Parallelization is Limited

JavaScript is single-threaded. Web Workers have high overhead:
- Message passing requires serialization
- SharedArrayBuffer has security requirements
- True parallelism requires multiple processes

---

### How Typoly Addresses These Issues

| Issue | JavaScript | Typoly (C++) |
|-------|----------|--------------|
| **Memory** | Dynamic objects need type flexibility | Statically typed values use exact size |
| **Binary Size** | Runtime helpers included | 157KB test_package (MinSizeRel) |
| **Embedded** | 50MB+ engine | Could be possible (not tested) |
| **Parallelization** | Web Workers | Native threads |

#### Memory Comparison

```javascript
// JavaScript
const arr = [1, 2, 3];
// Hidden class + inline cache + type tags required
// Each number: 8 bytes + engine metadata
```

```cpp
// C++ via Typoly
Vector<double> arr = {1, 2, 3};
// Just the values: 8 bytes * 3 = 24 bytes
// No runtime metadata needed
```

#### Embedded Use Case (Theoretical)

An Arduino Due (84MHz ARM) can run C++ but can't run V8. Typoly could theoretically enable:

```typescript
// This TypeScript code could become C++ for embedded...
function blink(times: number): void {
    for (let i = 0; i < times; i++) {
        digitalWrite(LED_BUILTIN, HIGH);
        delay(1000);
        digitalWrite(LED_BUILTIN, LOW);
        delay(1000);
    }
}
blink(5);
```

Would become:

```cpp
// This C++ could run on embedded hardware
void blink(int times) {
    for (int i = 0; i < times; i++) {
        digitalWrite(LED_BUILTIN, HIGH);
        delay(1000);
        digitalWrite(LED_BUILTIN, LOW);
        delay(1000);
    }
}
```

**Note**: This use case is not yet tested or specifically implemented. The Arduino/firmware libraries (`digitalWrite`, `delay`) would need custom stdlib implementations. However, the C++ code generated is standard C++20, so adding such support is theoretically possible.

**Binary Size**: The test_package project (see `.typoly_built/cpp/test.cpp`) compiles to ~157KB at `MinSizeRel` configuration with MSVC—a significant reduction from JavaScript engine requirements.
```

#### Server Backend

For high-throughput servers, native threads replace Web Workers:

```cpp
// Spawn 4 worker threads for parallel processing
std::vector<std::thread> workers;
for (int i = 0; i < 4; i++) {
    workers.emplace_back(processTask, taskQueue);
}
for (auto& w : workers) w.join();
```

---

### What Typoly Does NOT Guarantee

- **Speed**: V8's TurboFan performs aggressive optimizations. Hand-written C++ may be slower without careful optimization.
- **Correctness**: The transpiler is still evolving. Bugs in generated code are possible.
- **Full Support**: Not all TypeScript features are implemented.

---

### What Typoly DOES Enable

- **Smaller binaries** for the same functionality
- **Predictable memory use** without GC pauses
- **Embedded deployment** to resource-constrained devices
- **Native parallelization** with standard C++ threads
- **AOT deployment** - no warm-up phase

---

## Table of Contents

0. [Why This Project?](#why-this-project)
1. [TypeScript Transpilation Background](#1-typescript-transpilation-background)
2. [The Core Innovation](#2-the-core-innovation)
3. [The Factory Function Problem and Solution](#3-the-factory-function-problem-and-solution)
4. [Code Generation: generate_ts_printer.ts](#4-code-generation-generate_ts_printerts)
5. [Common Layer Architecture](#5-common-layer-architecture)
6. [C++ Printer Architecture](#6-c-printer-architecture)
7. [Mixin Inheritance Chain](#7-mixin-inheritance-chain)
8. [C++ Stdlib Implementation](#8-c-stdlib-implementation)
9. [Module System](#9-module-system)
10. [Union Types Handling](#10-union-types-handling)
11. [typeof Type Narrowing](#11-typeof-type-narrowing)
12. [Function Overrides System](#12-function-overrides-system)
13. [CLI and Build System](#13-cli-and-build-system)
14. [Project Structure](#14-project-structure)

---

## 1. TypeScript Transpilation Background

### 1.1 The Standard Pipeline

TypeScript transpiles by passing through these stages:

```
Source (.ts)
    ↓
Parser → AST (Abstract Syntax Tree)
    ↓
Transformers (AST → AST)
    ↓
Printer → Output (.js)
```

The TypeScript compiler (`tsc`) already has highly sophisticated systems for each stage:
- **Parser**: `ts.createSourceFile()` - parses source into AST
- **Transformers**: Functions that transform AST nodes 
- **Printer**: `createPrinter()` - emits text from AST

### 1.2 Why Reuse Them?

The TypeScript printer handles:
- All 200+ syntax kinds (FunctionDeclaration, CallExpression, BinaryExpression, etc.)
- Proper indentation and formatting
- Comments and JSDoc
- Source maps
- Thousands of edge cases

Writing this from scratch would be a massive undertaking. The key insight: **TypeScript and C++ syntax are similar enough** that most printing logic can be shared.

---

## 2. The Core Innovation

### 2.1 The Approach

Instead of writing a new printer from scratch, we:

1. **Generate** a base printer class from TypeScript's source
2. **Extend** it via class inheritance  
3. **Override** specific methods to output C++

```
ts.createProgram() → AST → Custom Printer → C++ Output
```

### 2.2 Original Printer Methods Remain

The inherited methods handle most AST nodes unchanged:

```typescript
// In RawTypescriptPrinter (generated from TS source)
emitFunctionDeclaration(node: FunctionDeclaration): void {
    // Outputs: function foo() { }
    // Also works for C++: void foo() { }
}
```

Only methods needing C++ specifics are overridden in the mixins.

---

## 3. The Factory Function Problem and Solution

### 3.1 Why Regular Inheritance Didn't Work

TypeScript's printer doesn't use classes—it uses **factory functions**:

```typescript
// From TypeScript's emitter.ts
function createPrinter(
    printerOptions: PrinterOptions, 
    handlers?: PrintHandlers
): Printer {
    return {
        printFile(sourceFile) { ... },
        emit(node) { ... },
        // ... hundreds more methods
    };
}
```

This returns a plain object, not a class instance. You can't extend factory functions with class inheritance.

### 3.2 The Solution: Transform Factory to Class

The script `out_languages/common/generate_ts_printer.ts`:

1. **Fetches** TypeScript's `emitter.ts` from GitHub (v5.9.3)
2. **Transforms** factory functions into class methods
3. **Adds** new parameters to key functions
4. **Saves** the result to `out_languages/common/ts_printer.ts`

The transformation:

```typescript
// BEFORE: factory function
function createPrinter(options) {
    return { emitFunctionDeclaration(node) { ... } };
}

// AFTER: class method  
class RawTypescriptPrinter {
    emitFunctionDeclaration(node: FunctionDeclaration): void {
        // same implementation
    }
}
```

### 3.3 Key Parameters Added

The script patches functions to accept additional parameters:

```typescript
// emitFiles - now accepts custom printer function
export function emitFiles(
    resolver, host, targetSourceFile,
    { scriptTransformers, declarationTransformers },
    emitOnly, onlyBuildInfo, forceDtsEmit, skipBuildInfo,
    createPrinterFunc = createPrinter,    // NEW: custom printer factory
    typeChecker?: ts.TypeChecker          // NEW: type checker
): EmitResult

// createPrinter - now accepts extra context
export function createPrinter(
    extra: EmitterExtraContext,           // NEW: context with typeChecker, etc.
    printerOptions: PrinterOptions = {},
    handlers: PrintHandlers = {}
): Printer
```

These parameters allow the emit pipeline to:
- Use a custom printer instead of TypeScript's default
- Query types via `typeChecker.getTypeAtLocation(node)`

---

## 4. Code Generation: generate_ts_printer.ts

### 4.1 Location and Purpose

**File**: `out_languages/common/generate_ts_printer.ts`

This script:
1. Downloads TypeScript's `emitter.ts` from GitHub
2. Applies transformations
3. Saves to `ts_printer.ts` (and `.orig` backup)

Runs only when upgrading TypeScript versions.

### 4.2 Transformations Applied

```typescript
const patches = {
    // Add EmitterExtraContext parameter to createPrinter
    createPrinter: [{
        args: 'extra: EmitterExtraContext, ' + originalArgs
    }],
    
    // Add createPrinterFunc and typeChecker to emitFiles
    emitFiles: [{
        args: originalArgs + ', createPrinterFunc = createPrinter, typeChecker?: ts.TypeChecker'
    }],
    
    // Modify emitJsFileOrBundle to use custom printer
    emitJsFileOrBundle: [{
        body: body => body.replace('createPrinter(', 'createPrinterFunc({typeChecker, ...}, ')
    }],
    
    // Custom output extension (allows .cpp instead of .js)
    getOutputExtension: [{
        body: '\n    return typoly_getOutputExtension(fileName, options);'
    }]
};
```

### 4.3 The EmitterExtraContext

**File**: `out_languages/common/emitter_extra.ts`

```typescript
export type EmitterExtraContext = {
    typeChecker?: TypeChecker        // Query types at AST nodes
    compilerOptions?: CompilerOptions  // Compiler settings
    resolver?: EmitResolver      // Module resolution info
    host?: EmitHost             // File system, etc.
};
```

This is the bridge between the emit pipeline and our custom printer.

---

## 5. Common Layer Architecture

### 5.1 Directory Structure

```
out_languages/common/
├── ts_printer.ts          # RawTypescriptPrinter (generated from TS)
├── ts_printer.ts.orig   # Original copy from GitHub
├── generate_ts_printer.ts # Generator script
├── emitter_extra.ts    # EmitterExtraContext & helpers
└── base_printer.ts   # TypolyBasePrinter
```

### 5.2 TypolyBasePrinter

**File**: `out_languages/common/base_printer.ts`

Base class for all language printers, provides shared utilities:

```typescript
export class TypolyBasePrinter extends RawTypescriptPrinter {
    typeChecker: ts.TypeChecker | undefined;
    packageName: string = "main";
    currentModuleName: string = "";
    namespaceImports: Map<string, string> = new Map();
    namedImports: Map<string, string> = new Map();

    // --- Shared helpers ---
    
    // Parse generic arguments: "T, U" → ["T", "U"]
    protected splitGenericArgs(args: string): [string, string];
    
    // Check if node has export modifier
    protected isExported(node: Node): boolean;
    
    // Get class name containing node
    protected getContainingClassName(node: Node): string;
    
    // Get base class name from extends clause
    protected getBaseClassName(node: Node): string | undefined;
    
    // Escape string literals
    protected escapeString(str: string): string;
    
    // Extract compile-time value from expression
    protected extractArgumentValue(arg: ts.Expression): any;
    
    // Get data type of argument (string, number, boolean, etc.)
    protected getArgumentDataType(arg: ts.Expression): string | undefined;
}
```

---

## 6. C++ Printer Architecture

### 6.1 Directory Structure

```
out_languages/cpp/
├── config/
│   ├── resolver.ts              # Function override resolution
│   ├── types.ts               # TypeScript types for config
│   └── function_overrides.json # Function overload config
├── printer/
│   ├── index.ts             # CppPrinter (final)
│   ├── base.ts              # CppPrinterBase
│   └── mixins/
│       ├── declarations.ts  # Classes, functions, enums, variables
│       ├── expressions.ts  # Binary ops, calls, property access
│       ├── statements.ts # If, for, while, return, try
│       └── imports.ts    # Import/export, source file
└── stdlib/               # C++20 modules
    ├── builtin.mxx        # Base types
    ├── union.mxx         # Union<T, U>
    ├── console.mxx       # Console
    ├── math.mxx         # Math
    ├── fs.mxx, os.mxx, path.mxx, etc.
```

### 6.2 CppPrinterBase

**File**: `out_languages/cpp/printer/base.ts`

Extends `TypolyBasePrinter` with C++-specific utilities:

```typescript
export class CppPrinterBase extends TypolyBasePrinter {
    // --- Module name conversion ---
    
    // "src/utils/helper.ts" → "src__utils__helper"
    protected computeModuleName(filePath: string): string;
    
    // "./utils" → "src__utils"
    protected toCppModulePath(tsModuleName: string): string;

    // --- Type mapping ---
    
    // TypeNode → C++ type: "string" → "String", "number" → "double"
    protected typeToString(typeNode: TypeNode): string;
    
    // Inferred type → C++: "string[]" → "Vector<String>"
    protected mapInferredType(tsType: string): string;
    
    // Handle type references (Array<T> → Vector<T>)
    protected handleTypeReference(ref: ts.TypeReferenceNode): string;

    // --- Utility ---
    
    // Escape C++ keywords: "class" → "class_"
    protected escapeCppKeyword(name: string): string;
    
    // Resolve function override from config
    protected resolveFunctionOverride(
        fullFunctionName: string, 
        args: ts.NodeArray<ts.Expression>
    ): { cppFunction: string } | null;
}
```

### 6.3 Type Mapping

| TypeScript | C++ | Note |
|-----------|-----|------|
| `string` | `String` | Custom wrapper |
| `number` | `double` | |
| `boolean` | `bool` | |
| `void` | `void` | |
| `any` | `Value` | |
| `string[]` | `Vector<String>` | |
| `T \| U` | `Union<T, U>` | Union type |
| `Map<K,V>` | `Map<K,V>` | |
| `Set<T>` | `Set<T>` | |
| `RegExp` | `RegExp` | Custom class |
| `Date` | `Date` | Custom class |

---

## 7. Mixin Inheritance Chain

### 7.1 Why Mixins?

Each file handles one category of AST nodes. This keeps code manageable and provides clear boundaries.

```
RawTypescriptPrinter (base from TS)
    ↓ extends
TypolyBasePrinter (shared helpers)
    ↓ extends
CppPrinterBase (C++ utilities)
    ↓ extends
DeclarationsMixin (declarations.ts)
    ↓ extends
ExpressionsMixin (expressions.ts)
    ↓ extends
StatementsMixin (statements.ts)
    ↓ extends
ImportsMixin (imports.ts)
    ↓ extends
CppPrinter (index.ts - empty, just inherits)
```

### 7.2 Mixin Responsibilities

| Mixin | File | Handles |
|-------|------|---------|
| DeclarationsMixin | `declarations.ts` | `class`, `function`, `enum`, `interface`, `type alias`, `var/let/const` |
| ExpressionsMixin | `expressions.ts` | `a + b`, `foo()`, `obj.prop`, literals |
| StatementsMixin | `statements.ts` | `if`, `for`, `while`, `return`, `try/catch`, typeof checks |
| ImportsMixin | `imports.ts` | `import`, `export`, source file emission |

### 7.3 How They Connect

When emitting a source file:

1. `ImportsMixin.emitSourceFile()` is called
2. Iterates statements, calls `this.emit(stmt)`
3. For functions → `DeclarationsMixin.emitFunctionDeclaration()`
4. For calls → `ExpressionsMixin.emitCallExpression()`
5. For operators → `ExpressionsMixin.emitBinaryExpression()`

Each mixin only overrides what it needs; the rest falls through to the parent.

---

## 8. C++ Stdlib Implementation

### 8.1 Module Files

The stdlib is implemented as C++20 modules (`.mxx` files). These wrap JavaScript APIs in idiomatic C++.

### 8.2 Key Modules

**builtin.mxx** - Base types:
```cpp
export module typoly_std_builtin;

export namespace typoly_std_builtin {
    // String class - wraps std::string with JS-like API
    class String {
    public:
        size_t length() const;
        String slice(int start, int end) const;
        // ... more methods
    };
    
    // Vector<T> - wraps std::vector
    template <typename T>
    class Vector {
    public:
        void push_back(const T& value);
        T& at(size_t index);
        size_t size() const;
        // ... more methods
    };
    
    // Map<K, V> - wraps std::map
    // Set<T> - wraps std::set
    // etc.
}
```

**union.mxx** - Union types:
```cpp
export module typoly_std_union;

export namespace typoly_std_union {
    template <typename... Ts>
    class Union {
    private:
        std::variant<Ts...> var_;  // Uses std::variant internally
    public:
        // Construct from value
        template <typename T>
        Union(T&& value);
        
        // Type checking
        template <typename T>
        bool holds() const;
        
        // Get value
        template <typename T>
        T& as();
    };
}
```

### 8.3 std::variant Behind the Scenes

The `Union` class wraps `std::variant`:

```cpp
#include <variant>

template <typename... Ts>
class Union {
    std::variant<Ts...> var_;  // The actual storage
    
public:
    template <typename T>
    bool holds() const {
        return std::holds_alternative<T>(var_);  // Check type
    }
    
    template <typename T>
    T& as() {
        return std::get<T>(var_);  // Get value
    }
};
```

This is why typeof narrowing works: `value.holds<String>()` calls `std::holds_alternative<String>()`.

---

## 9. Module System

### 9.1 Import Conversion

TypeScript imports are converted to C++20 modules:

```typescript
// TypeScript
import { testVariables } from './tests/test_variables';
import * as fs from 'fs';
import utils from './utils';
```

Becomes:

```cpp
// C++
import tests__test_variables;
import typoly_std_fs;  // Node.js core modules map to stdlib
import src__utils;

namespace tests__test_variables {
    void testVariables();
}
```

### 9.2 Module Name Conversion

**Method**: `toCppModulePath()` in `CppPrinterBase`

```typescript
protected toCppModulePath(tsModuleName: string): string {
    let name = tsModuleName.replace(/^["']|["']$/g, "");  // Remove quotes
    name = name.replace(/^(\.\/)/, "");                       // Remove ./
    name = name.replace(/^(\.\.\/)/, "../");
    name = name.replace(/\//g, "__");                     // / → __
    name = name.replace(/\./g, "");                     // Remove .
    name = name.replace(/-/g, "_");                    // - → _
    name = name.replace(/\.tsx?$/, "");                 // Remove .ts/.tsx
    return name;
}
```

### 9.3 The emitSourceFile Process

**File**: `out_languages/cpp/printer/mixins/imports.ts`

The `emitSourceFile()` method:

1. **Emit global module fragment** (required for header includes)
2. **Emit module declaration**: `export module test;`
3. **Emit imports**: `import tests__test_variables;`
4. **Categorize statements**: declarations vs TLD (top-level code)
5. **Emit forward declarations** (for hoisting)
6. **Emit __tld() function** (executes top-level code)
7. **Emit actual declarations**

### 9.4 TLD (Top-Level Declarations) Handling

JavaScript allows top-level code execution. C++ doesn't. The transpiler:

```cpp
// JavaScript (in test.ts)
console.log("hello");
const x = 5;
testFunction();

// C++ - wrapped in __tld() function
export void __tld() {
    __TLD_INIT();
    console::log("hello");
    const double x = 5;
    testFunction();
}
```

The `__tld()` function is called from `main()` at runtime.

### 9.5 TLD Macros Explained

The TLD system uses macros defined in `out_languages/cpp/stdlib/typoly_macros.h`. Each macro has a specific purpose:

**`typoly_macros.h`** - The macro definitions:
```cpp
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
```

**Expanded explanations:**

| Macro | Definition | Purpose |
|------|-------------|---------|
| `__TLD_INITIALIZED` | `bool __tld_initialized = false;` | Boolean flag to track if TLD has run (prevents re-execution) |
| `__TLD_INIT()` | `if (__tld_initialized) return; __tld_initialized = true; __imported_modules_tld();` | Guard that returns early if already initialized, then sets flag and calls imported modules' TLD functions |
| `__IMPORT_TLD(modulename)` | `modulename::__tld();` | Calls another module's `__tld()` function to initialize its top-level code first |
| `__IMPORT_TLD_BLOCK({ ... })` | Defines `void __imported_modules_tld() { ... }` | Wraps multiple `__IMPORT_TLD()` calls into a single function |
| `__IMPORT_TLD_BLOCK_EMPTY()` | Defines empty `void __imported_modules_tld() {}` | For modules with no dependencies |

**Complete example:**

```cpp
// Source
import { testVariables } from './tests/test_variables';
console.log("hello");
```

Generates:

```cpp
#include "typoly_macros.h"

namespace test {
    // Forward declarations
    void testVariables();
    
    // Import TLD block - calls dependencies first
    __IMPORT_TLD_BLOCK({
        __IMPORT_TLD(tests__test_variables);
    });
    
    // TLD initialization flag
    __TLD_INITIALIZED;
    
    // TLD function - entry point for top-level code
    export void __tld() {
        __TLD_INIT();           // If already initialized, return early
                              // Otherwise: set flag, call imported TLDs
        
        console::log("hello");  // Actual top-level code
    }
    
    void testVariables() { ... }
}
```

When `main()` calls `test::__tld()`:
1. `__TLD_INIT()` is called
2. If not initialized (`__tld_initialized == false`):
   - Sets `__tld_initialized = true`
   - Calls `__imported_modules_tld()` → calls `tests__test_variables::__tld()` first
   - Executes the top-level code: `console::log("hello")`
3. If already initialized, returns early (idempotent)

### 9.6 Import TLD Blocks

For modules that import each other, dependencies must initialize first:

```cpp
__IMPORT_TLD_BLOCK({
    __IMPORT_TLD(tests__test_variables);
    __IMPORT_TLD(tests__test_functions);
});
```

Each module's `__tld()` calls its dependencies' `__tld()` first.

---

## 10. Union Types Handling

### 10.1 The Challenge

TypeScript union types (`string | number`) have no direct C++ equivalent. JavaScript variables can hold any type; C++ variables are statically typed.

### 10.2 The Solution: Union<T, U> Class

The stdlib provides `Union<T, U, ...>` using `std::variant`:

```cpp
// out_languages/cpp/stdlib/union.mxx
template <typename... Ts>
class Union {
    std::variant<Ts...> var_;
public:
    template <typename T>
    bool holds() const {
        return std::holds_alternative<T>(var_);
    }
    
    template <typename T>
    T& as() {
        return std::get<T>(var_);
    }
};
```

### 10.3 Type Inference

When the type checker detects a union type:

```typescript
let u: string | number = "hello";
```

It generates:

```cpp
Union<String, double> u = "hello";
```

### 10.4 Example Transformation

TypeScript:
```typescript
function processValue(value: string | number): string {
    if (typeof value === "string") {
        return "String value";
    } else {
        return "Number value";
    }
}
```

C++:
```cpp
String processValue(Union<String, double> value) {
    if (value.holds<String>()) {
        return "String value";
    } else {
        return "Number value";
    }
}
```

The function parameter is automatically typed as `Union<String, double>`. The `typeof` check becomes `value.holds<String>()`.

---

## 11. typeof Type Narrowing

### 11.1 How It Works

**File**: `out_languages/cpp/printer/mixins/statements.ts`

The code detects `typeof x === "string"` patterns:

```typescript
// Map TypeScript typeof results to C++ types
const TYPEOF_MAP: Record<string, string> = {
    "string": "String",
    "number": "double", 
    "boolean": "bool",
    "object": "Value",
    "function": "Function",
    "undefined": "Value",
};
```

### 11.2 Detection Logic

```typescript
private isTypeofCheck(node: ts.Expression): { variable: string, type: string, isPositive: boolean } | null {
    // Check: typeof x === "string" (left side)
    if (ts.isTypeOfExpression(node.left) && ts.isStringLiteral(node.right)) {
        const typeArg = node.left.expression;
        if (ts.isIdentifier(typeArg)) {
            const typeStr = node.right.text;
            const cppType = TYPEOF_MAP[typeStr];
            if (cppType) {
                return { variable: typeArg.text, type: cppType, isPositive: true };
            }
        }
    }
    // Also checks: "string" === typeof x (right side)
    // ... same logic
}
```

### 11.3 Code Generation

In `emitIfStatement()`:

```typescript
emitIfStatement(node: IfStatement): void {
    const typeofCheck = this.isTypeofCheck(node.expression);
    
    if (typeofCheck && this.typeChecker) {
        // Query the variable's type
        const type = this.typeChecker.getTypeOfSymbolAtLocation(symbol, node);
        const typeStr = this.typeChecker.typeToString(type);
        
        if (typeStr.includes("|") || typeStr.startsWith("Union")) {
            // Generate: value.holds<Type>()
            this.write(typeofCheck.variable);
            this.write(".holds<");
            this.write(typeofCheck.type);
            this.write(">()");
        } else {
            // Type already known → simplify to true
            this.write("true");
        }
    } else {
        // Normal if statement
        this.emitExpression(node.expression);
    }
}
```

### 11.4 Simplified Output

For simple variable declarations, `typeof x === "string"` becomes `if (true)`:

```typescript
let value: string = "hello";
if (typeof value === "string") { ... }
```

Generates:

```cpp
String value = "hello";
if (true) { ... }
```

This works because the variable's type is already known as `String` from the declaration.

---

## 12. Function Overrides System

### 12.1 Why Overrides?

Some JavaScript functions have different overloads based on arguments:

```javascript
// fs.readFileSync(path)
// fs.readFileSync(path, { encoding: 'utf8' })
// fs.readFileSync(path, { encoding: 'binary' })
```

These need different C++ implementations.

### 12.2 Configuration File

**File**: `out_languages/cpp/config/function_overrides.json`

```json
{
  "functions": {
    "fs.readFileSync": {
      "optionParameter": 1,
      "optionName": "encoding",
      "overloads": {
        "utf8": {
          "cppFunction": "readFileSync",
          "returnType": "String"
        },
        "base64": {
          "cppFunction": "readFileSyncBase64", 
          "returnType": "String"
        },
        "binary": {
          "cppFunction": "readFileSyncBuffer",
          "returnType": "Vector<double>"
        }
      },
      "default": {
        "cppFunction": "readFileSync",
        "returnType": "String"
      }
    }
  }
}
```

### 12.3 Resolution Logic

**File**: `out_languages/cpp/config/resolver.ts`

```typescript
export function resolveFunctionOverride(
    functionName: string,
    args: any[],
    optionValue?: string,
    dataType?: string
): ResolvedOverride {
    const config = getFunctionOverrideConfig(functionName);
    
    // Check each overload condition
    for (const [name, overload] of Object.entries(config.overloads)) {
        switch (overload.condition.type) {
            case 'parameterCount':
                if (args.length === overload.condition.value) {
                    return { cppFunction: overload.cppFunction, ... };
                }
                break;
            case 'optionValue':
                if (optionValue === condition.value) {
                    return { cppFunction: overload.cppFunction, ... };
                }
                break;
        }
    }
    
    return { cppFunction: config.default.cppFunction, ... };
}
```

### 12.4 Usage in Printer

In `emitCallExpression()`:

```typescript
emitCallExpression(node: CallExpression): void {
    const propExpr = node.expression;
    const fullFunctionName = `${importedModule}.${methodName}`;
    const override = this.resolveFunctionOverride(fullFunctionName, node.arguments);
    
    if (override) {
        this.write(importedModule);
        this.write("::");
        this.write(override.cppFunction);
        this.emitArguments(node.arguments);
    }
}
```

---

## 13. CLI and Build System

### 13.1 Entry Point

**File**: `index.ts`

The CLI:
1. Parses arguments: `--lang cpp|go`, `--out <dir>`, `--file <file>`, `--watch`
2. Creates TypeScript program: `ts.createProgram()`
3. Overrides emit to use custom printer
4. Generates build files (CMakeLists.txt, go.mod)

### 13.2 Custom Emit Process

The key is overriding `program.emit()`:

```typescript
program.emit = (sourceFile, ...) => {
    // Instead of default JS printer, use our C++ printer
    let result = tc.runWithCancellationToken(() => emitFiles(
        emitresolver,
        emithost,
        sourceFile,
        { declarationTransformers: [], scriptTransformers: [] },
        emitOnly,
        false,
        forceDtsEmit,
        skipBuildInfo,
        createPrinterFunc,    // Our printer factory
        tc                  // Type checker
    ));
    return result;
};
```

### 13.3 Generated Build Files

For C++, generates:
- **CMakeLists.txt** - CMake build configuration
- **main.cpp** - Entry point calling `__tld()`
- **typoly_macros.h** - TLD and import macros
- **stdlib/** - Copied C++ modules

### 13.4 CMakeLists.txt Structure

```cmake
cmake_minimum_required(VERSION 3.28)
project(test_package LANGUAGES CXX)

set(CMAKE_CXX_STANDARD 20)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

add_subdirectory(stdlib typoly_stdlib)

set(MODULE_SOURCES
    "test.cpp"
    "tests/test_variables.cpp"
    ...
)

add_executable(${PROJECT_NAME} ${MODULE_SOURCES} main.cpp)
target_sources(${PROJECT_NAME} PRIVATE FILE_SET CXX_MODULES FILES ${MODULE_SOURCES})
target_link_libraries(${PROJECT_NAME} PRIVATE typoly_stdlib)
```

---

## 14. Project Structure

### 14.1 Root Directory

```
typoly/
├── index.ts                   # CLI entry point
├── package.json             # Dependencies
├── tsconfig.json           # TypeScript config
├── DEVELOPERS.md          # This file
├── Union.md              # Union design notes
└── test_package/         # Test suite
    ├── test.ts         # Main test
    ├── tests/        # Individual tests
    ├── subfolder/    # Subdirectory tests
    └── .typoly_built/  # Generated output
        └── cpp/
            ├── test.cpp
            ├── tests/
            ├── stdlib/
            ├── CMakeLists.txt
            └── main.cpp
```

### 14.2 Key Files Reference

| Path | Purpose |
|------|---------|
| `index.ts` | CLI, program creation, custom emit |
| `out_languages/common/ts_printer.ts` | Generated RawTypescriptPrinter |
| `out_languages/common/base_printer.ts` | TypolyBasePrinter |
| `out_languages/common/emitter_extra.ts` | EmitterExtraContext |
| `out_languages/cpp/printer/base.ts` | CppPrinterBase |
| `out_languages/cpp/printer/mixins/*.ts` | Mixin chain |
| `out_languages/cpp/config/resolver.ts` | Function override resolution |
| `out_languages/cpp/config/function_overrides.json` | Overrides config |
| `out_languages/cpp/stdlib/*.mxx` | C++ stdlib modules |

### 14.3 Test Files

| Test File | Tests |
|-----------|-------|
| `tests/test_variables.ts` | Variables, constants |
| `tests/test_functions.ts` | Functions, arrow functions |
| `tests/test_classes.ts` | Classes, inheritance |
| `tests/test_arrays.ts` | Arrays, methods |
| `tests/test_strings.ts` | String methods |
| `tests/test_operators.ts` | Binary operators |
| `tests/test_control_flow.ts` | if, for, while, switch |
| `tests/test_union_*.ts` | Union type handling |
| `tests/test_imports_exports.ts` | Module imports |
| `tests/test_math.ts`, `test_date.ts`, `test_regexp.ts`, etc. | Stdlib APIs |

---

## Summary

Typoly works by:

1. **Generating** a base printer class from TypeScript source (factory → class transformation)
2. **Extending** via class inheritance with mixins
3. **Mapping** types: TS `string` → C++ `String`, `number` → `double`, `T|U` → `Union<T,U>`
4. **Handling** typeof narrowing: `typeof x === "string"` → `x.holds<String>()`
5. **Wrapping** top-level code in `__tld()` function
6. **Generating** build files (CMakeLists.txt)

The result is idiomatic C++20 code that preserves the structure and semantics of the original TypeScript.