// Test: Imports and Exports
// Tests module import/export functionality

// Import from the same package
import testImportsExports from "./test_imports_exports"

export function testImports() {
    console.log("Testing imports/exports...")
    
    // Test 1: Use imported function
    let result1 = testImportsExports.exportedHelper(21)
    console.log("1: exportedHelper(21) =", result1)
    
    // Test 2: Use imported constant
    console.log("2: exportedConst =", testImportsExports.exportedConst)
    
    // Test 3: Multiple calls
    let result2 = testImportsExports.exportedHelper(testImportsExports.exportedConst)
    console.log("3: exportedHelper(exportedConst) =", result2)
    
    // Test 4: Direct usage
    console.log("4: Direct usage:", testImportsExports.exportedHelper)
    
    console.log("Imports/Exports test passed")
}
