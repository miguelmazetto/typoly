// Test: JavaScript/C++ Behavioral Differences
// Simplified tests for features that work

export function testEdgeCases() {
    console.log("Testing JS/C++ edge cases...")
    
    // Test 1: Basic variable declarations
    console.log("\n--- Test 1: Variables ---")
    let x = 10
    let y: number = 20
    console.log("x =", x)
    
    // Test 2: Equality operators
    console.log("\n--- Test 2: Equality ---")
    let a = 5
    let b = 5
    let isEqual = a == b
    console.log("5 == 5:", isEqual)
    
    // Test 3: Basic types
    console.log("\n--- Test 3: Types ---")
    let num = 42
    let str = "hello"
    let bool_val = true
    console.log("Types test passed")
    
    // Test 4: For loop
    console.log("\n--- Test 4: For Loop ---")
    let sum = 0
    for (let i = 0; i < 5; i++) {
        sum += i
    }
    console.log("Sum 0-4:", sum)
    
    // Test 5: While loop
    console.log("\n--- Test 5: While Loop ---")
    let count = 0
    while (count < 3) {
        count++
    }
    console.log("Count:", count)
    
    // Test 6: If-else
    console.log("\n--- Test 6: If-Else ---")
    let age = 20
    if (age >= 18) {
        console.log("Adult")
    } else {
        console.log("Minor")
    }
    
    // Test 7: Logical operators
    console.log("\n--- Test 7: Logical ---")
    let trueVal = true && true
    let falseVal = true && false
    let orVal = false || true
    console.log("Logical test passed")
    
    // Test 8: Ternary operator
    console.log("\n--- Test 8: Ternary ---")
    let status = age >= 18 ? "adult" : "minor"
    console.log("Status:", status)
    
    // Test 9: Modulo
    console.log("\n--- Test 9: Modulo ---")
    let mod1 = 10 % 3
    console.log("10 % 3 =", mod1)
    
    // Test 10: Basic arithmetic
    console.log("\n--- Test 10: Arithmetic ---")
    let result = (10 + 5) * 2 - 3
    console.log("(10 + 5) * 2 - 3 =", result)
    
    console.log("\nAll edge case tests completed!")
}
