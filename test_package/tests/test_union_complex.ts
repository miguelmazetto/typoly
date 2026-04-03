// Test: Union Class Complex Usage
// Tests Union class with function parameters and complex scenarios

// Helper function that takes a Union parameter
function processValue(value: string | number): string {
    if (typeof value === "string") {
        return "String value"
    } else {
        return "Number value"
    }
}

// Helper function with union parameter
function innerHelper(x: string | number): string | number {
    if (typeof x === "string") {
        return x
    } else {
        return x
    }
}

export function testUnionComplex() {
    console.log("Testing complex Union usage...")
    
    // Test 1: Function with union parameter (string)
    let result1 = processValue("hello")
    console.log("1:", result1)
    
    // Test 2: Function with union parameter (number)
    let result2 = processValue(42)
    console.log("2:", result2)
    
    // Test 3: Union reassignment
    let u: string | number = "start"
    console.log("3a:", u)
    u = 100
    console.log("3b:", u)
    u = "end"
    console.log("3c:", u)
    
    // Test 4: Union in conditional
    let check: string | number = 50
    if (typeof check === "number") {
        console.log("4: Check is number")
    }
    
    // Test 5: Helper function with union
    let inner1 = innerHelper("test")
    let inner2 = innerHelper(123)
    if (typeof inner1 === "string") {
        console.log("5a:", inner1)
    }
    if (typeof inner2 === "number") {
        console.log("5b:", inner2)
    }
    
    console.log("Complex Union test passed")
}
