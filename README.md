# Typoly

TypeScript to C++20 transpiler.

**Status: WIP / Not for production use.**

## What

Typoly converts TypeScript to C++20. It uses the TypeScript compiler for parsing and type checking, generates idiomatic C++.

```
TS input        →  C++ output
function add    →  double add
  (a: number,     (double a,
   b: number)      double b)
```

## Supported

- Types: `string` → `String`, `number` → `double`, `boolean` → `bool`
- Unions: `string | number` → `Union<String, double>` (via `std::variant`)
- Imports → C++20 modules
- Top-level code → `__tld()` function

## Not Supported / WIP

- Many TS features missing
- Embedded hardware: theoretical only, not tested
- Speed: not guaranteed (V8 optimizations may outperform naive C++)

## Usage

Run from the **target project** directory (the TypeScript project to transpile):

```bash
# From typoly directory, run against target project
cd /path/to/my-target-project
bun /path/to/typoly/index.ts --lang cpp
```

Output: `./typoly_built/cpp/`

Build:
```bash
cd .typoly_built/cpp
cmake -B build
cmake --build build
```

## Docs

- [English](./docs/en-us/index.md)
- [Português](./docs/pt-br/index.md)

## License

Apache 2.0 - See [LICENSE](./LICENSE)