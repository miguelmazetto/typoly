# JavaScript/TypeScript vs C++ Behavioral Differences

This document outlines the subtle differences between JavaScript/TypeScript and C++ that are handled by the Typoly transpiler.

## ✅ Handled Differences

### 1. Function Hoisting
**JavaScript:** Functions can be called before they're defined.
```javascript
foo();  // Works
function foo() { console.log("hello"); }
```

**C++ Solution:** Forward declarations are automatically generated.
```cpp
void foo();  // Forward declaration
// Now foo() can be called
void foo() { console::log("hello"); }
```

### 2. Variable Declarations
**JavaScript:** `var`, `let`, `const` with different scoping rules.
**C++ Solution:** All converted to typed declarations with inferred types.
```typescript
let x = 5;  // TypeScript
```
```cpp
double x = 5;  // C++ (type inferred)
```

### 3. Module System
**JavaScript:** `import/export` statements.
**C++ Solution:** C++20 modules with namespace wrapping.
```typescript
import { foo } from './module';
```
```cpp
import module;
module::foo();
```

### 4. Top-Level Declarations (TLD)
**JavaScript:** Code can run at module level.
**C++ Solution:** `__tld()` function with initialization tracking.

### 5. Console Output
**JavaScript:** `console.log()`
**C++ Solution:** `console::log()` via stdlib

### 6. Type System
**JavaScript:** Dynamic typing.
**C++ Solution:** Static typing with inference where possible.

## ⚠️ Limitations

### 1. Type Coercion
JavaScript allows implicit type coercion:
```javascript
"5" + 3  // "53" (string)
"5" - 3  // 2 (number)
```
C++ requires explicit types. The transpiler uses strong typing.

### 2. Prototype Chain
JavaScript's prototype-based inheritance is not available in C++.
Classes are transpiled to C++ classes, not prototypes.

### 3. Event Loop
JavaScript's async/event loop model doesn't exist in C++.
`async/await` would need coroutines (not yet implemented).

### 4. Dynamic Object Properties
JavaScript allows adding properties at runtime:
```javascript
obj.newProp = 5;
```
C++ requires fixed class members.

### 5. `undefined` vs `null`
JavaScript has both. C++ uses `nullptr` for both.

### 6. NaN Behavior
`NaN !== NaN` works the same in both languages.

### 7. Division by Zero
JavaScript: `1/0` → `Infinity`
C++: `1/0` → Undefined behavior (avoid this)

## Usage Notes

- Use explicit types where possible for better C++ compatibility
- Avoid relying on JavaScript's type coercion
- Use classes instead of prototype-based patterns
- Avoid runtime property additions to objects
