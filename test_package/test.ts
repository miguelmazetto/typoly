import * as subff from './subfolder/testsubf'
import { testArrays } from './tests/test_arrays'
import { testClasses } from './tests/test_classes'
import { testControlFlow } from './tests/test_control_flow'
import { testDate } from './tests/test_date'
import { testFs } from './tests/test_fs'
import { testFunctions } from './tests/test_functions'
import { testImports } from './tests/test_imports_exports'
import { testJSON } from './tests/test_json'
import { testMath } from './tests/test_math'
import { testOperators } from './tests/test_operators'
import { testRegExp } from './tests/test_regexp'
import { testStrings } from './tests/test_strings'
import { testVariables } from './tests/test_variables'
import { testEdgeCases } from './tests/test_edge_cases'
import { testUnionTypes } from './tests/test_union_types'
import { testUnionEdgeCases } from './tests/test_union_edge_cases'
import { testUnionDirect } from './tests/test_union_direct'
import { testUnionComplex } from './tests/test_union_complex'

// Test hoisting: calling localFunction before it's defined
localFunction()

// Run all tests
console.log("========================================")
console.log("Running Typoly Tests")
console.log("========================================")

// Test 1: Variables
console.log("\n--- Test 1: Variables ---")
testVariables()

// Test 2: Functions
console.log("\n--- Test 2: Functions ---")
testFunctions()

// Test 3: Arrays
console.log("\n--- Test 3: Arrays ---")
testArrays()

// Test 4: Classes
console.log("\n--- Test 4: Classes ---")
testClasses()

// Test 5: Control Flow
console.log("\n--- Test 5: Control Flow ---")
testControlFlow()

// Test 6: Operators
console.log("\n--- Test 6: Operators ---")
testOperators()

// Test 7: Strings
console.log("\n--- Test 7: Strings ---")
testStrings()

// Test 8: Math
console.log("\n--- Test 8: Math ---")
testMath()

// Test 9: JSON
console.log("\n--- Test 9: JSON ---")
testJSON()

// Test 10: RegExp
console.log("\n--- Test 10: RegExp ---")
testRegExp()

// Test 11: Date
console.log("\n--- Test 11: Date ---")
testDate()

// Test 12: File System
console.log("\n--- Test 12: File System ---")
testFs()

// Test 13: Imports/Exports
console.log("\n--- Test 13: Imports/Exports ---")
testImports()

// Test 14: Module Import
console.log("\n--- Test 14: Module Import ---")
subff.subf_exported_func()

// Test 15: Edge Cases (JS/C++ differences)
console.log("\n--- Test 15: Edge Cases ---")
testEdgeCases()

// Test 16: Union Types
console.log("\n--- Test 16: Union Types ---")
testUnionTypes()

// Test 17: Union Edge Cases
console.log("\n--- Test 17: Union Edge Cases ---")
testUnionEdgeCases()

// Test 18: Union Direct Usage
console.log("\n--- Test 18: Union Direct ---")
testUnionDirect()

// Test 19: Union Complex Usage
console.log("\n--- Test 19: Union Complex ---")
testUnionComplex()

// Local function (defined after it's called - tests hoisting)
function localFunction(): void {
    console.log("Local function called (hoisting works!)")
}

// Export function
export function main() {
    console.log("Main function called")
}

console.log("\n========================================")
console.log("All tests completed!")
console.log("========================================")
