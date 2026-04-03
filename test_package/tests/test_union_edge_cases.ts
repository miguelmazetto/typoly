// Test: Union Type Edge Cases (Simplified)
// Tests for typeof patterns in if statements

export function testUnionEdgeCases() {
    console.log("Testing union edge cases...")
    
    // Test 1: Multiple typeof checks in sequence
    let val1: string = "hello"
    
    if (typeof val1 === "string") {
        console.log("1a: val1 is string")
    } else if (typeof val1 === "number") {
        console.log("1b: val1 is number")
    } else {
        console.log("1c: val1 is something else")
    }
    
    // Test 2: Nested typeof checks
    let outer: number = 42
    let inner: string = "test"
    
    if (typeof outer === "number") {
        console.log("2a: outer is number")
        if (typeof inner === "string") {
            console.log("2b: inner is string")
        }
    }
    
    // Test 3: Negated typeof
    let neg: string = "text"
    if (typeof neg !== "number") {
        console.log("3: neg is not a number")
    }
    
    // Test 4: Multiple variables with typeof (separate if statements)
    let a: string = "a"
    let b: number = 10
    
    if (typeof a === "string") {
        console.log("4a: a is string")
    }
    if (typeof b === "number") {
        console.log("4b: b is number")
    }
    
    // Test 5: Multiple typeof checks for same variable
    let check: number = 42
    if (typeof check === "number") {
        console.log("5a: check is number")
    }
    if (typeof check === "string") {
        console.log("5b: check is string (won't print)")
    }
    console.log("5: typeof check done")
    
    // Test 6: typeof in loop
    let loop: number = 0
    for (let i = 0; i < 3; i++) {
        if (typeof loop === "number") {
            console.log("6: loop is number at iteration", i)
        }
    }
    
    // Test 7: typeof with comparison
    let comp1: number = 5
    let comp2: number = 5
    if (typeof comp1 === "number") {
        if (comp1 == comp2) {
            console.log("7: comp1 and comp2 are equal numbers")
        }
    }
    
    // Test 8: typeof in if-else chain
    let chain: string = "test"
    if (typeof chain === "string") {
        console.log("8a: chain is string")
    } else if (typeof chain === "number") {
        console.log("8b: chain is number")
    } else {
        console.log("8c: chain is other")
    }
    
    // Test 9: typeof in while loop
    let whileVar: number = 0
    while (whileVar < 2) {
        if (typeof whileVar === "number") {
            console.log("9: whileVar is number", whileVar)
        }
        whileVar++
    }
    
    // Test 10: After reassignment
    let reassign: number = 100
    console.log("10a: reassign =", reassign)
    reassign = 200
    console.log("10b: reassign =", reassign)
    
    // Test 11: typeof with true/false
    let bool: boolean = true
    if (typeof bool === "boolean") {
        console.log("11: bool is boolean")
    }
    
    // Test 12: Chained if with typeof
    let chained: number = 5
    if (typeof chained === "number") {
        console.log("12a: chained is number")
        if (chained > 3) {
            console.log("12b: chained > 3")
        }
    }
    
    // Test 13: typeof with string literal
    let strLit: string = "literal"
    if (typeof strLit === "string") {
        console.log("13: strLit is string")
    }
    
    // Test 14: typeof in for-of style
    let items: number[] = [1, 2, 3]
    for (const item of items) {
        if (typeof item === "number") {
            console.log("14: item is number")
            break
        }
    }
    
    console.log("Union edge cases test completed!")
}
