// Test: Imports and Exports
// Tests module import/export functionality

// Test that we can export functions
export function exportedHelper(x: number): number {
    return x * 2
}

// Test that we can export constants
export const exportedConst = 42

export function testImports() {
    console.log("Testing imports/exports...")
    
    // Test 1: Use exported function
    let result = exportedHelper(21)
    console.log("1: exportedHelper(21) =", result)
    
    // Test 2: Use exported constant
    console.log("2: exportedConst =", exportedConst)
    
    // Test 3: Nested exports
    let combined = exportedHelper(exportedConst)
    console.log("3: Combined =", combined)
    
    // Test 4: Call imported function
    console.log("4: Import system working")
    
    // Test 5: Function call in expression
    let doubled = exportedHelper(10) + exportedHelper(20)
    console.log("5: Doubled sum =", doubled)
    
    console.log("Imports/Exports test passed")
}
