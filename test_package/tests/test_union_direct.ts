// Test: Union Class Direct Usage (Simplified for MSVC)
// Uses only primitive types to avoid module resolution issues

export function testUnionDirect() {
    console.log("Testing Union class directly...")
    
    // Test 1: Basic type check with number
    let num: number = 42
    
    if (typeof num === "number") {
        console.log("1: num is number")
    }
    
    // Test 2: Type check with different value
    let val: number = 100
    
    if (typeof val === "number") {
        console.log("2: val is number")
    }
    
    // Test 3: Multiple variables
    let a: number = 1
    let b: number = 2
    
    if (typeof a === "number") {
        console.log("3a: a is number")
    }
    if (typeof b === "number") {
        console.log("3b: b is number")
    }
    
    // Test 4: Reassignment
    let reassigned: number = 100
    console.log("4a: reassigned =", reassigned)
    reassigned = 200
    console.log("4b: reassigned =", reassigned)
    
    // Test 5: Boolean type
    let bool: boolean = true
    if (typeof bool === "boolean") {
        console.log("5: bool is boolean")
    }
    
    // Test 6: In loop
    for (let i = 0; i < 3; i++) {
        let val: number = i
        if (typeof val === "number") {
            console.log("6: val is number at", i)
        }
    }
    
    // Test 7: Nested checks
    let outer: number = 42
    let inner: number = 100
    
    if (typeof outer === "number") {
        console.log("7a: outer is number")
        if (typeof inner === "number") {
            console.log("7b: inner is number")
        }
    }
    
    // Test 8: After reassignment
    let reassign: number = 50
    if (typeof reassign === "number") {
        console.log("8a: reassign is number before")
    }
    reassign = 100
    if (typeof reassign === "number") {
        console.log("8b: reassign is number after")
    }
    
    // Test 9: Loop with type check
    let loopVal: number = 0
    while (loopVal < 2) {
        if (typeof loopVal === "number") {
            console.log("9: loopVal is number", loopVal)
        }
        loopVal++
    }
    
    // Test 10: Boolean reassignment
    let flag: boolean = true
    if (typeof flag === "boolean") {
        console.log("10a: flag is boolean")
    }
    flag = false
    if (typeof flag === "boolean") {
        console.log("10b: flag is still boolean")
    }
    
    console.log("Union direct test completed!")
}
