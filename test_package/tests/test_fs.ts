// Test: File System Operations
// Tests fs module from the stdlib

import * as fs from 'fs'

export function testFs() {
    console.log("Testing file system...")
    
    // Test 1: Write file
    fs.writeFileSync("test_output.txt", "Hello from fs!")
    console.log("1: File written")
    
    // Test 2: Check file exists
    let fileExists = fs.existsSync("test_output.txt")
    console.log("2: File exists:", fileExists)
    
    // Test 3: Read file
    let content = fs.readFileSync("test_output.txt")
    console.log("3: Content:", content)
    
    // Test 4: Check non-existent file
    let noFile = fs.existsSync("nonexistent.txt")
    console.log("4: Non-existent:", noFile)
    
    // Test 5: Append to file
    fs.appendFileSync("test_output.txt", "\nSecond line")
    let newContent = fs.readFileSync("test_output.txt")
    console.log("5: After append:", newContent)
    
    // Test 6: Create directory
    fs.mkdirSync("test_dir")
    let dirExists = fs.existsSync("test_dir")
    console.log("6: Dir created:", dirExists)
    
    // Test 7: Write to file in directory
    fs.writeFileSync("test_dir/inner.txt", "Inside dir")
    let innerExists = fs.existsSync("test_dir/inner.txt")
    console.log("7: Inner file:", innerExists)
    
    // Test 8: Read inner file
    let innerContent = fs.readFileSync("test_dir/inner.txt")
    console.log("8: Inner content:", innerContent)
    
    // Test 9: Remove file
    fs.rmSync("test_dir/inner.txt")
    let innerRemoved = !fs.existsSync("test_dir/inner.txt")
    console.log("9: Inner removed:", innerRemoved)
    
    // Test 10: Remove directory
    fs.rmSync("test_dir")
    let dirRemoved = !fs.existsSync("test_dir")
    console.log("10: Dir removed:", dirRemoved)
    
    // Test 11: Remove test file
    fs.rmSync("test_output.txt")
    let testRemoved = !fs.existsSync("test_output.txt")
    console.log("11: Test file removed:", testRemoved)
    
    // Test 12: Verify cleanup
    let allClean = !fs.existsSync("test_output.txt") && !fs.existsSync("test_dir")
    console.log("12: All cleaned:", allClean)
    
    console.log("File system test passed")
}
