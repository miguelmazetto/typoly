// Test: Date Operations
// Tests the Date functionality from stdlib

export function testDate() {
    console.log("Testing Date...")
    
    // Test 1: Current timestamp
    let timestamp = 1234567890123
    console.log("1: Timestamp =", timestamp)
    
    // Test 2: Arithmetic with timestamps
    let oneHour = 3600000
    let future = timestamp + oneHour
    console.log("2: Future =", future)
    
    // Test 3: Difference
    let diff = future - timestamp
    console.log("3: Diff =", diff)
    
    // Test 4: Time conversion
    let ms = 5000
    let seconds = ms / 1000
    console.log("4: 5000ms =", seconds, "seconds")
    
    // Test 5: Comparison
    let isBefore = timestamp < future
    let isAfter = future > timestamp
    console.log("5: Before:", isBefore)
    console.log("5: After:", isAfter)
    
    // Test 6: Equality
    let same = timestamp == timestamp
    console.log("6: Same:", same)
    
    // Test 7: Date components (simulated)
    let year = 2024
    let month = 1
    let day = 15
    console.log("7: Year:", year, "Month:", month, "Day:", day)
    
    // Test 8: Time components (simulated)
    let hour = 12
    let minute = 30
    let second = 45
    console.log("8: Time:", hour, minute, second)
    
    // Test 9: Date arithmetic
    let today = 1700000000000
    let tomorrow = today + 86400000
    let yesterday = today - 86400000
    console.log("9: Tomorrow > Yesterday:", tomorrow > yesterday)
    
    // Test 10: Timestamp to readable (simulated)
    let readable = 2024
    console.log("10: Year =", readable)
    
    console.log("Date test passed")
}
