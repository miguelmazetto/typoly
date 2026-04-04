# DEVELOPERS.md



## Overview



**Typoly** is a TypeScript transpiler that targets **C++20** and **Go**. It aims to bridge the gap between TypeScript's developer experience and the performance of systems languages. The project uses the TypeScript Compiler API to parse source files and a custom mixin-based printer architecture to emit target language code.



<!--## Architecture-->



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

&#x20;   ├── test.ts               # Main test entry

&#x20;   ├── tests/                # Individual test files

&#x20;   └── .typoly_built/        # Generated output (gitignored)

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

---

*Last Updated: 2026-04-04*

