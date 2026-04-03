// Test: Functions
// This file tests function declarations and expressions

// Helper function
function add(a: number, b: number): number {
    return a + b;
}

// Helper function with no return
function logMessage(msg: string): void {
    console.log(msg)
}

// Function with multiple parameters
function multiply(x: number, y: number, z: number): number {
    return x * y * z
}

// Function returning string
function greet(name: string): string {
    return "Hello, " + name
}

export function testFunctions() {
    console.log("Testing functions...")
    
    // Test 1: Basic function call
    let sum = add(2, 3)
    console.log("1: 2 + 3 =", sum)
    
    // Test 2: Function with void return
    logMessage("2: Message logged")
    
    // Test 3: Multiple parameters
    let product = multiply(2, 3, 4)
    console.log("3: 2 * 3 * 4 =", product)
    
    // Test 4: String return
    let greeting = greet("World")
    console.log("4:", greeting)
    
    // Test 5: Nested function calls
    let nested = add(add(1, 2), add(3, 4))
    console.log("5: (1+2) + (3+4) =", nested)
    
    // Test 6: Function in expression
    let result = add(10, 20) * 2
    console.log("6: (10 + 20) * 2 =", result)
    
    console.log("Functions test passed")
}
