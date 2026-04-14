# DEVELOPERS.md

## Overview

**Typoly** is a TypeScript transpiler that targets **C++20** and **Go**. It uses the TypeScript Compiler API to parse source files and a custom mixin-based printer architecture to emit target language code.

## Architecture

### Core Pipeline

1. **CLI Parsing**: Arguments are parsed in `index.ts` (language, output path, entry file).
2. **TS Program Creation**: `ts.createProgram` parses the entry file and its dependencies.
3. **AST Traversal**: The printer traverses the TypeScript AST node-by-node.
4. **Mixin-Based Printing**: Language-specific printers are composed via class inheritance (not function-based mixins).
5. **TLD Handling**: Top-Level Declarations are handled separately to manage initialization order via `Tld()`/`TldInitialized`.
6. **Build System Generation**: CMakeLists.txt (C++) or go.mod (Go) are generated automatically.

### Directory Structure

```
project/
├── index.ts                    # Main entry point & CLI
├── core/                       # Core emitter utilities
│   └── emitter_extra.ts        # Base class for all printers (text writer, AST helpers)
├── generated/                  # Generated base printer class (from TS compiler)
│   └── printer.ts              # CPrinter - the base class all printers inherit from
├── out_languages/              # Language-specific implementations
│   ├── cpp/                    # C++20 target
│   │   ├── printer/
│   │   │   ├── index.ts        # CppPrinter composition
│   │   │   ├── base.ts         # C++ specific base utilities
│   │   │   └── mixins/
│   │   │       ├── declarations.ts
│   │   │       ├── expressions.ts
│   │   │       ├── statements.ts
│   │   │       └── imports.ts
│   │   └── stdlib/             # C++20 module wrappers (.mxx files)
│   │       ├── builtin_basic_types.mxx
│   │       ├── builtin.mxx
│   │       ├── console.mxx
│   │       ├── math.mxx
│   │       ├── fs.mxx
│   │       ├── regexp.mxx
│   │       ├── date.mxx
│   │       └── path.mxx
│   └── go/                     # Go target
│       ├── printer/
│       │   ├── index.ts        # GoPrinter composition
│       │   ├── base.ts         # Go specific base utilities (typeToString, toPascalCase, etc.)
│       │   └── mixins/
│       │       ├── declarations.ts   # Classes, functions, variables, enums, interfaces
│       │       ├── expressions.ts    # Operators, property access, calls, literals
│       │       ├── statements.ts     # if, for, while, return, switch, etc.
│       │       └── imports.ts        # Import/export, package scanning, Tld generation
│       └── stdlib/             # Go package wrappers
│           ├── typoly.go       # Core types (String, Vector, Map, Set, RegExp, MatchResult, etc.)
│           ├── union.go        # Union type wrapper
│           ├── console.go      # Console wrapper
│           ├── math.go         # Math wrapper
│           ├── fs.go           # File system wrapper
│           ├── regexp.go       # RegExp wrapper
│           ├── date.go         # Date wrapper
│           └── path.go         # Path wrapper
├── test_package/               # Test suite
│   ├── test.ts                 # Main test entry (calls all test functions)
│   ├── tests/                  # Individual test files (one per feature)
│   └── .typoly_built/          # Generated output (gitignored)
└── typescript/                 # TypeScript compiler source (vendored)
```

## Printer Mixin Architecture

Both C++ and Go printers use a **class inheritance chain** (not function-based mixins):

```
CPrinter (generated/printer.ts)
  └── GoPrinterBase (out_languages/go/printer/base.ts)
        └── DeclarationsMixin (out_languages/go/printer/mixins/declarations.ts)
              └── ExpressionsMixin (out_languages/go/printer/mixins/expressions.ts)
                    └── StatementsMixin (out_languages/go/printer/mixins/statements.ts)
                          └── ImportsMixin (out_languages/go/printer/mixins/imports.ts)
                                └── GoPrinter (out_languages/go/printer/index.ts)
```

Each mixin extends the previous one in the chain. The final `GoPrinter` class is empty — it just inherits the entire chain.

### Key Methods by Mixin

#### DeclarationsMixin
- `emitClassDeclaration` — Generates Go `struct` with `NewXxx` constructor
- `emitFunctionDeclaration` — Generates `func` with exported name capitalization
- `emitVariableStatement` — Handles `let`, `const`, `var` with type inference
- `emitEnumDeclaration` — Generates Go `const (iota)` blocks
- `emitInterfaceDeclaration` — Generates Go `interface {}` types
- `emitTypeAliasDeclaration` — Generates Go `type` aliases
- `emitParameter` / `emitParamsList` — Function parameter emission
- `emitMethod` — Struct methods with receiver

#### ExpressionsMixin
- `emitBinaryExpression` — Operators (`==`, `!=`, `&&`, `||`, `+`, etc.)
- `emitPropertyAccessExpression` — Property access with PascalCase conversion
- `emitCallExpression` — Function/method calls with package resolution
- `emitNewExpression` — `new` expressions (RegExp, class instantiation)
- `emitArrayLiteralExpression` — Go slice literals
- `emitObjectLiteralExpression` — Go map literals
- `emitArrowFunction` / `emitFunctionExpression` — Anonymous functions
- `emitConsoleCall` / `emitMathCall` / `emitStringMethodCall` — Stdlib helpers
- `isInterfaceVarAccess` — Tracks `interface{}`-typed variables for type assertions
- `trackValueVar` — Tracks variables assigned from `.Value` property access

#### StatementsMixin
- `emitBlock` — `{ ... }` blocks
- `emitIfStatement` — `if` with typeof simplification and nullable nil-checks
- `emitWhileStatement` — `for condition { ... }`
- `emitForStatement` — Standard for loops
- `emitForInStatement` / `emitForOfStatement` — `for _, v := range`
- `emitReturnStatement` / `emitThrowStatement` — `return` / `panic`
- `emitSwitchStatement` / `emitBreakStatement` / `emitContinueStatement`

#### ImportsMixin
- `emitSourceFile` — Main file emission: package, imports, declarations, Tld
- `emitImportDeclaration` — Import path resolution and package tracking
- `preScanAST` — Pre-scans AST to detect needed imports (Math, strings, typoly)
- `getImportedPackageForFunction` — Resolves function calls to package-qualified names
- `trackExportedName` / `isExportedName` — Tracks exported function names for call capitalization
- `getNamedImport` — Resolves named imports (e.g., `import { foo } from './bar'`)

### Base Class Utilities (GoPrinterBase)

Located in `out_languages/go/printer/base.ts`:

- `typeToString(typeNode)` — Converts TS TypeNode to Go type string
- `handleTypeReference(ref)` — Resolves type references (Array → `[]T`, Promise → `interface{}`, etc.)
- `toCamelCase(str)` / `toPascalCase(str)` — Name conversion utilities
- `isExported(node)` — Checks for `export` keyword
- `getContainingClassName(node)` — Finds the enclosing class name for methods/accessors
- `getBaseClassName(node)` — Finds the base class for super calls
- `getImportedModuleName(expr)` — Resolves imported module paths
- `computeImportPath(moduleName)` — Computes Go import path from TS module specifier
- `computePackageName(fileName)` — Derives Go package name from source file path
- `resolveFunctionOverride(fullName, args)` — Checks for C++/Go function override mappings
- `escapeStringForGo(str)` — Escapes strings for Go literal syntax

### Core Emitter (emitter_extra.ts)

The `CPrinter` base class in `core/emitter_extra.ts` provides:

- Text writing (`write`, `writeLine`, `writeSpace`, `writeKeyword`, `writeOperator`, `writePunctuation`, `writeComment`)
- Indentation management (`increaseIndent`, `decreaseIndent`)
- Node text extraction (`getTextOfNode`)
- Type checking via the TypeScript TypeChecker
- AST dispatch (`emit` method routes to appropriate `emitXxx` handler)

## Go-Specific Implementation Details

### Module Path Resolution

When transpiling `test_package/test.ts`:
- The Go module name is set to `test_package` (derived from the entry file path)
- Import paths like `./tests/test_variables` become `test_package/tests/test_variables`
- Output directory structure strips the module prefix so files are at `./tests/test_variables/test_variables.go`
- The `go.mod` declares `module test_package`

### Exported Name Capitalization

Go requires exported identifiers to start with uppercase. The printer handles this:

- **Functions**: `export function testVariables()` → `func TestVariables()`
- **Variables**: `export const exportedConst = 42` → `const exportedConst = 42` (kept lowercase for same-package access)
- **Classes/Types**: `class Calculator` → `type Calculator struct`
- **Methods**: `add(n: number)` → `func (this *Calculator) Add(n float64)`
- **Calls**: `testVariables()` from another package → `test_variables.TestVariables()`

### Named Import Resolution

When a file imports specific functions:
```ts
import { testVariables } from './tests/test_variables'
testVariables()
```
The printer tracks these in `namedImportMap` and emits:
```go
test_variables.TestVariables()
```

### Type Handling

| TypeScript | Go |
|---|---|
| `string` | `string` |
| `number` | `float64` |
| `boolean` | `bool` |
| `void` | (empty return) |
| `any` / `unknown` | `interface{}` |
| `T[]` | `[]T` |
| `T \| U` (union) | `interface{}` |
| `T & U` (intersection) | `interface{}` |
| `() => T` (function) | `func` |
| `null` / `undefined` | `nil` |
| `this` | `this` |

### Union Type Handling

Union types (`string | number`) are emitted as `interface{}` in Go. The printer tracks:
- Variables declared with union types → `var name interface{} = value`
- Variables assigned from property access on interface vars → also tracked as `interface{}`
- Property access on tracked interface vars → type assertion: `(var.(*typoly.MatchResult)).Value`
- Variables assigned from `.Value` on an interface var → tracked separately to avoid double type assertion

### typeof Simplification

`typeof x === "string"` conditions are simplified to `true` with a `_ = x;` statement to suppress unused variable warnings. This handles the pattern where TypeScript's type narrowing has no Go equivalent.

### Nullable Truthiness

`if (execResult)` where `execResult` is an `interface{}`-typed variable becomes `if execResult != nil` in Go.

### TLD (Top-Level Declaration) System

TypeScript allows top-level code execution. Go requires explicit initialization. The printer:

1. Separates declarations (functions, classes, types) from TLD statements (variable assignments, function calls)
2. Emits declarations at package level
3. Generates a `Tld()` function that:
   - Calls `Tld()` on imported packages (if not already initialized)
   - Executes TLD statements in order
4. The generated `main.go` calls the entry package's `Tld()` function

### Const Handling

- **Literal const**: `const x = 42` → `const x = 42` (Go const)
- **Function call const**: `const x = Math.abs(-5)` → `x := math.Abs(-5)` (Go variable, since Go const can't hold function results)

## How It Works

### CLI Usage

 ```bash
 # Transpile to C++20
 bun run index.ts --lang cpp

 # Transpile to Go
 bun run index.ts --lang go

 # Custom output directory
 bun run index.ts --lang go -o ./build

 # Custom entry file
 bun run index.ts --file src/main.ts --lang cpp

 # Watch mode - recompile on file changes (TypeScript watch mode)
 bun run index.ts --lang go --watch
 bun run index.ts --lang cpp -w
 ```

### Running Tests

```bash
# Transpile tests
bun run index.ts --lang go

# Run Go tests
cd .typoly_built/go_test/go && go run ./...

# Build C++ project
cd .typoly_built/cpp && cmake -B build && cmake --build build
```

## Standard Library (Stdlib)

### Go Stdlib (`out_languages/go/stdlib/`)

The `typoly` package provides TypeScript-compatible types:

- **String** — `Length()`, `CharAt()`, `CharCodeAt()`, `Concat()`, `Includes()`, `IndexOf()`, `LastIndexOf()`, `Slice()`, `Substring()`, `ToUpperCase()`, `ToLowerCase()`, `Trim()`, `TrimStart()`, `TrimEnd()`, `Split()`, `Replace()`, `ReplaceAll()`, `StartsWith()`, `EndsWith()`, `Repeat()`
- **Vector** — `Push()`, `Pop()`, `Shift()`, `Unshift()`, `At()`, `Set()`, `Length()`, `IsEmpty()`, `Clear()`, `Contains()`, `IndexOf()`, `LastIndexOf()`, `Slice()`, `Splice()`, `Concat()`, `Join()`, `Reverse()`, `Sort()`, `ForEach()`, `Map()`, `Filter()`, `Reduce()`, `Find()`, `FindIndex()`, `Every()`, `Some()`, `Flat()`, `FlatMap()`
- **Map** — `Set()`, `Get()`, `Has()`, `Delete()`, `Clear()`, `Size()`, `Keys()`, `Values()`, `Entries()`, `ForEach()`
- **Set** — `Add()`, `Has()`, `Delete()`, `Clear()`, `Size()`, `Keys()`, `Values()`, `Entries()`, `ForEach()`
- **RegExp** — `NewRegExp(pattern, flags)`, `Test()`, `Exec()`, `Match()`, `MatchAll()`, `Replace()`, `ReplaceAll()`, `Search()`, `Split()`
- **Date** — `NewDate()`, `Now()`, `FromTimestamp()`, `GetTime()`, `SetTime()`, `GetYear()`, `GetMonth()`, `GetDay()`, `GetHours()`, `GetMinutes()`, `GetSeconds()`, `GetMilliseconds()`, comparison operators
- **MatchResult** — `Value` (string), `Index` (int), `Input` (string), `Groups` ([]string)
- **Union** — Type wrapper for union types (rarely used directly; `interface{}` preferred)

### C++ Stdlib (`out_languages/cpp/stdlib/`)

C++20 module wrappers (`.mxx` files) providing similar APIs.

## Supported Features

### TypeScript Features

- ✅ Variables (`let`, `const`, `var`)
- ✅ Functions & Arrow Functions
- ✅ Classes & Constructors
- ✅ Interfaces & Type Aliases
- ✅ Enums
- ✅ Arrays & Array Methods (`push`, `pop`, `map`, `filter`, etc.)
- ✅ String Methods (`includes`, `toLowerCase`, `replace`, etc.)
- ✅ Union Types (via `interface{}`)
- ✅ Type Inference
- ✅ Import/Export (named and namespace imports)
- ✅ Control Flow (`if`, `for`, `while`, `switch`)
- ✅ Try/Catch
- ✅ Math & Date objects
- ✅ File System (fs module)
- ✅ RegExp (test, exec, match, matchAll, replace, replaceAll, search, split)
- ✅ JSON operations
- ✅ Operators (equality, comparison, logical, arithmetic, assignment)
- ✅ Ternary operator
- ✅ Nullish coalescing (`??`)
- ✅ typeof checks (simplified to `true`)
- ✅ Exported function capitalization
- ✅ Named import resolution

### Target Languages

- **C++20**: Modules, `std::` wrappers, CMake generation.
- **Go**: Packages, `go.mod` generation, standard library wrappers, Tld initialization system.

## Building & Running

### Prerequisites

- **Bun**: `bun install`
- **C++**: Clang++ or G++ with C++20 support.
- **Go**: Go 1.21+

### Running Tests

```bash
# Transpile tests
bun run index.ts --lang go

# Run Go tests
cd .typoly_built/go_test/go && go run ./...

# Build C++ project
cd .typoly_built/cpp && cmake -B build && cmake --build build
```

## Extending the Project

### Adding a New Language

1. Create `out_languages/<lang>/`.
2. Implement `base.ts` with language-specific utilities (extending `GoPrinterBase` or creating a new base).
3. Create mixins in `mixins/` for declarations, expressions, statements, imports.
4. Compose the printer in `index.ts` using class inheritance.
5. Implement `stdlib/` with target-language wrappers.

### Adding a New Feature

1. Identify which mixin handles the feature (e.g., `expressions.ts` for operators).
2. Implement the feature in the mixin.
3. Add tests in `test_package/tests/`.
4. Update `DEVELOPERS.md` if necessary.

### Adding a New Stdlib Method

1. Add the method to the appropriate Go file in `out_languages/go/stdlib/`.
2. Add the method mapping in `emitStringMethodCall`, `emitMathCall`, etc. in `expressions.ts`.
3. Add the method to the preScanAST detection if it triggers an import.
4. Add a test case.

## Known Limitations

1. **Union Types**: Complex union types are mapped to `interface{}` (Go). Runtime type checking requires manual type assertions.
2. **Nested Functions**: Go doesn't support top-level nested functions in the same way as TS. These are handled via `Tld()` initialization.
3. **Dynamic Typing**: Some TS dynamic patterns (e.g., `obj[prop]`) may require manual adaptation in the target language.
4. **Async/Await**: Not fully supported yet. Requires target-language async runtime integration.
5. **Generics**: TypeScript generics are simplified — generic functions emit `interface{}` parameters.
6. **typeof Simplification**: `typeof x === "string"` is always simplified to `true`. This works for tests but loses type narrowing semantics.
7. **Self-Hosting**: Transpiling the project itself has import path issues (the project's own files use `test_package/` prefix but the module name differs).

## Development Workflow

1. **Clone & Setup**:
```bash
git clone <repo>
cd typoly-ai
bun install
```

2. **Make Changes**:
- Edit mixins in `out_languages/<lang>/printer/mixins/`.
- Update stdlib in `out_languages/<lang>/stdlib/`.

3. **Test**:
- Add test cases in `test_package/tests/`.
- Run transpiler: `bun run index.ts --lang <lang>`.
- Verify output in `.typoly_built/<lang>/`.
- Build and run: `cd .typoly_built/<lang>/go && go run ./...`.

## Common Patterns

### Adding a New Expression Handler

```typescript
// In expressions.ts
emitMyNewExpression(node: MyNodeType): void {
    this.write("go_equivalent");
    this.writePunctuation("(");
    this.emitExpression(node.child);
    this.writePunctuation(")");
}
```

### Adding a New Statement Handler

```typescript
// In statements.ts
emitMyNewStatement(node: MyNodeType): void {
    this.writeKeyword("keyword");
    this.writeSpace();
    this.emitEmbeddedStatement(node, node.body);
}
```

### Tracking Variables for Special Handling

```typescript
// In expressions.ts
private myTrackedVars: Set<string> = new Set();

trackMyVar(name: string): void {
    this.myTrackedVars.add(name);
}

// In declarations.ts (when emitting variable declarations)
if (someCondition) {
    this.trackMyVar(name);
}

// In expressions.ts (when emitting property access)
if (this.myTrackedVars.has(objName)) {
    // Special handling
}
```

### Adding Import Detection

```typescript
// In imports.ts preScanAST
if (ts.isPropertyAccessExpression(node) && ts.isIdentifier(node.expression)) {
    const methodName = node.name.text;
    if (myMethods.includes(methodName)) {
        this.needsMyPackage = true;
    }
}

// In emitSourceFile import block
if (this.needsMyPackage) {
    this.write("\"my/package\"");
    this.writeLine();
}
```

---

*Last Updated: 2026-04-04*

# DEVELOPERS.md

## Overview

**Typoly AI** is a TypeScript transpiler that targets **C++20** and **Go**. It aims to bridge the gap between TypeScript's developer experience and the performance of systems languages. The project uses the TypeScript Compiler API to parse source files and a custom mixin-based printer architecture to emit target language code.

## Architecture

### Core Pipeline
1. **CLI Parsing**: Arguments are parsed in `index.ts` (language, output path, entry file).
2. **TS Program Creation**: `ts.createProgram` is used to parse the entry file and its dependencies.
2. **AST Traversal**: The printer traverses the TypeScript AST.
3. **Mixin-Based Printing**: Language-specific printers are composed of mixins to separate concerns (declarations, expressions, statements, imports).
4. **TLD Handling**: Top-Level Declarations are handled separately to manage initialization order.
5. **Build System Generation**: CMakeLists.txt (C++) or go.mod (Go) are generated automatically.

### Directory Structure

```
project/
├── index.ts                  # Main entry point & CLI
├── core/                     # Core emitter utilities
│   └── emitter_extra.ts
├── generated/                # Generated base printer class
│   └── printer.ts
├── out_languages/            # Language-specific implementations
│   ├── cpp/                  # C++20 target
│   │   ├── printer/          # C++ printer mixins
│   │   │   ├── index.ts      # CppPrinter composition
│   │   │   ├── base.ts       # C++ specific base utilities
│   │   │   └── mixins/       # Declaration, Expression, Statement, Import mixins
│   │   └── stdlib/           # C++ standard library wrappers
│   │       ├── builtin_basic_types.mxx
│   │       ├── builtin.mxx
│   │       ├── console.mxx
│   │       ├── math.mxx
│   │       ├── fs.mxx
│   │       ├── regexp.mxx
│   │       ├── date.mxx
│   │       └── path.mxx
│   └── go/                   # Go target
│       ├── printer/          # Go printer mixins
│       │   ├── index.ts      # GoPrinter composition
│       │   ├── base.ts       # Go specific base utilities
│       │   └── mixins/       # Declaration, Expression, Statement, Import mixins
│       └── stdlib/           # Go standard library wrappers
│           ├── typoly.go
│           ├── console.go
│           ├── math.go
│           ├── fs.go
│           ├── regexp.go
│           ├── date.go
│           └── path.go
└── test_package/             # Test suite
    ├── test.ts               # Main test entry
    ├── tests/                # Individual test files
    └── .typoly_built/        # Generated output (gitignored)
```

## How It Works

### 1. CLI Usage
 ```bash
 # Transpile to C++20
 bun run index.ts --lang cpp

 # Transpile to Go
 bun run index.ts --lang go

 # Custom output directory
 bun run index.ts --lang go -o ./build

 # Custom entry file
 bun run index.ts --file src/main.ts --lang cpp

 # Watch mode - recompile on file changes (TypeScript watch mode)
 bun run index.ts --lang go --watch
 bun run index.ts --lang cpp -w
 ```

### 2. Printer Architecture
The printer uses a **mixin pattern** to compose functionality:
- `DeclarationsMixin`: Handles `function`, `class`, `interface`, `enum`, `type`, `const`, `let`.
- `ExpressionsMixin`: Handles operators, property access, function calls, literals.
- `StatementsMixin`: Handles `if`, `for`, `while`, `switch`, `try/catch`.
- `ImportsMixin`: Handles `import`/`export` statements and package management.

Each language extends a base class (`GoPrinterBase` or `CppPrinterBase`) and applies these mixins.

### 3. TLD (Top-Level Declaration) Handling
TypeScript allows top-level code execution. C++ and Go require explicit initialization. The printer:
1. Scans for top-level declarations and statements.
2. Emits declarations at the package/namespace level.
3. Generates a `__tld()` function to handle initialization order.
4. Calls `__tld()` from the generated `main()` function.

### 4. Standard Library (Stdlib)
To mimic TypeScript/JavaScript behavior, the project provides wrapper types:
- **Types**: `String`, `Vector<T>`, `Map<K,V>`, `Set<T>`, `RegExp`, `Date`.
- **Modules**: `console`, `math`, `fs`, `os`, `path`, `json`.
- These are implemented in the target language to provide JS-like APIs (e.g., `str.includes()`, `vec.push()`).

## Supported Features

### TypeScript Features
- ✅ Variables (`let`, `const`, `var`)
- ✅ Functions & Arrow Functions
- ✅ Classes & Constructors
- ✅ Interfaces & Type Aliases
- ✅ Enums
- ✅ Arrays & Array Methods (`push`, `pop`, `map`, `filter`, etc.)
- ✅ String Methods (`includes`, `toLowerCase`, `replace`, etc.)
- ✅ Union Types (via `Union<T>` or `interface{}`)
- ✅ Type Inference
- ✅ Import/Export
- ✅ Control Flow (`if`, `for`, `while`, `switch`)
- ✅ Try/Catch
- ✅ Math & Date objects
- ✅ File System (fs module)

### Target Languages
- **C++20**: Modules, `std::` wrappers, CMake generation.
- **Go**: Packages, `go.mod` generation, standard library wrappers.

## Building & Running

### Prerequisites
- **Bun**: `bun install`
- **C++**: Clang++ or G++ with C++20 support.
- **Go**: Go 1.21+

### Running Tests
```bash
# Transpile tests
bun run index.ts --lang go

# Run Go tests
cd .typoly_built/go && go test ./...

# Build C++ project
cd .typoly_built/cpp && cmake -B build && cmake --build build
```

## Extending the Project

### Adding a New Language
1. Create `out_languages/<lang>/`.
2. Implement `base.ts` with language-specific utilities.
3. Create mixins in `mixins/` for declarations, expressions, statements, imports.
4. Compose the printer in `index.ts`.
5. Implement `stdlib/` with target-language wrappers.

### Adding a New Feature
1. Identify which mixin handles the feature (e.g., `expressions.ts` for operators).
2. Implement the feature in the mixin.
3. Add tests in `test_package/tests/`.
4. Update `DEVELOPERS.md` if necessary.

## Known Limitations

1. **Union Types**: Complex union types are mapped to `Union<T>` (C++) or `interface{}` (Go). Runtime type checking may be required.
2. **Nested Functions**: Go doesn't support top-level nested functions in the same way as TS. These are handled via `__tld()` initialization.
3. **Dynamic Typing**: Some TS dynamic patterns (e.g., `obj[prop]`) may require manual adaptation in the target language.
4. **Async/Await**: Not fully supported yet. Requires target-language async runtime integration.

## Development Workflow

1. **Clone & Setup**:
   ```bash
   git clone <repo>
   cd typoly-ai
   bun install
   ```

2. **Make Changes**:
   - Edit mixins in `out_languages/<lang>/printer/mixins/`.
   - Update stdlib in `out_languages/<lang>/stdlib/`.

3. **Test**:
   - Add test cases in `test_package/tests/`.
   - Run transpiler: `bun run index.ts --lang <lang>`.
   - Verify output in `.typoly_built/<lang>/`.

4. **Commit**:
   - Follow conventional commits.
   - Update documentation if necessary.

## Contact & Support
- **Issues**: GitHub Issues
- **Discussions**: GitHub Discussions
- **PRs**: Welcome! Please follow the workflow above.

---
*Last Updated: 2026-04-04*