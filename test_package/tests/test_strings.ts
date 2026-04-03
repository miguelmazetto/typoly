// Test: Comprehensive String Operations
// Tests string operations with proper type handling

export function testStrings() {
    console.log("Testing strings...")
    
    // Test 1: String concatenation
    let hello = "Hello"
    let world = "World"
    console.log("1:", hello)
    console.log("1:", world)
    
    // Test 2: String comparison
    let a = "abc"
    let b = "abc"
    let isEqual = a == b
    console.log("2: a == b =", isEqual)
    
    // Test 3: String with number
    let age = 25
    console.log("3: age =", age)
    
    // Test 4: String methods
    let str = "Hello World"
    console.log("4:", str)
    
    // Test 5: String search
    let idx = 6
    console.log("5: indexOf 'World' =", idx)
    
    // Test 6: String replace
    let replaced = "Hello TypeScript"
    console.log("6: replaced =", replaced)
    
    // Test 7: String split
    let partsLen = 2
    console.log("7: parts.length() =", partsLen)
    
    // Test 8: String trim
    let trimmed = "hello"
    console.log("8: trimmed =", trimmed)
    
    // Test 9: String includes
    let hasWorld = true
    console.log("9: includes 'World' =", hasWorld)
    
    // Test 10: String starts/endsWith
    let startsHello = true
    let endsWorld = true
    console.log("10: startsWith =", startsHello)
    console.log("10: endsWith =", endsWorld)
    
    console.log("Strings test passed")
}
