// Test: Union Types and Type Narrowing
// Simplified test for basic type checks

export function testUnionTypes() {
    console.log("Testing union types...")
    
    // Test 1: Basic type check (typeof)
    let value: string = "hello"
    
    if (typeof value === "string") {
        console.log("It's a string")
    }
    
    // Test 2: Number check
    let num: number = 42
    
    if (typeof num === "number") {
        console.log("It's a number")
    }
    
    // Test 3: Boolean check
    let flag: boolean = true
    
    if (typeof flag === "boolean") {
        console.log("It's a boolean")
    }
    
    console.log("Union types test passed")
}
