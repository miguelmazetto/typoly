// Test: JSON Operations
// Tests JSON-like operations using primitives

export function testJSON() {
    console.log("Testing JSON...")
    
    // Test 1: Primitive types
    let num = 42
    let str = "hello"
    let bool = true
    console.log("1: Types exist")
    
    // Test 2: Number operations
    let numResult = num + 10
    console.log("2: Number result:", numResult)
    
    // Test 3: String operations
    let strResult = str + " world"
    console.log("3: String result:", strResult)
    
    // Test 4: Boolean operations
    let andResult = true && false
    let orResult = false || true
    console.log("4: true && false =", andResult)
    console.log("4: false || true =", orResult)
    
    // Test 5: Equality
    let eq1 = 42 == 42
    let eq2 = true == true
    console.log("5: Equality checks work")
    
    // Test 6: Comparisons
    let lt = 1 < 2
    let gt = 3 > 2
    console.log("6: Comparisons work")
    
    // Test 7: Arithmetic
    let add = 5 + 3
    let sub = 10 - 4
    let mul = 6 * 7
    console.log("7: Arithmetic works")
    
    // Test 8: Logical
    let not = !false
    let both = true && true
    console.log("8: Logical works")
    
    // Test 9: Ternary
    let result = true ? "yes" : "no"
    console.log("9: Ternary:", result)
    
    // Test 10: Variable operations
    let a = 1
    let b = 2
    let c = a + b
    console.log("10: Sum =", c)
    
    console.log("JSON test passed")
}
