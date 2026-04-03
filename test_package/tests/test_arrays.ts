// Test: Comprehensive Array Methods
// Tests array operations with proper C++ compatibility

export function testArrays() {
    console.log("Testing arrays...")
    
    // Test 1: Array creation and access
    let arr1 = [1, 2, 3]
    let first = arr1[0]
    let last = arr1[2]
    console.log("1: first =", first, "last =", last)
    
    // Test 2: Array size (using size() which is supported)
    let len = arr1.length
    console.log("2: size =", len)
    
    // Test 3: Array in loop
    let sum = 0
    let i = 0
    while (i < 3) {
        sum = sum + arr1[i]
        i++
    }
    console.log("3: Sum =", sum)
    
    // Test 4: Manual array operations
    let total = arr1[0] + arr1[1] + arr1[2]
    console.log("4: Total =", total)
    
    console.log("Arrays test passed")
}
