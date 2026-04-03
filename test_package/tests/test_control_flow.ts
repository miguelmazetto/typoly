// Test: Control Flow
export function testControlFlow() {
    const x = 10;
    
    // If-else
    if (x > 5) {
        console.log("x > 5");
    } else {
        console.log("x <= 5");
    }
    
    // For loop
    for (let i = 0; i < 3; i++) {
        console.log("Loop iteration");
    }
    
    // While loop
    let count = 0;
    while (count < 3) {
        count++;
    }
    
    console.log("Control flow test passed");
}
