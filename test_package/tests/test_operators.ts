// Test: Operators
// This file tests basic TypeScript operators

export function testOperators() {
    // Arithmetic operators
    const a = 10;
    const b = 3;
    const sum = a + b;
    const diff = a - b;
    const prod = a * b;
    const div = a / b;
    
    // Comparison operators
    const isEqual = a == 10;
    const isGreater = a > b;
    
    // Logical operators
    const and = true && false;
    const or = false || true;
    const not = !true;
    
    console.log("Operators test passed");
}
