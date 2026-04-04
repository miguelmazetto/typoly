// Test: Comprehensive Class Operations
// Tests class operations with proper instantiation

class Calculator {
    value: number;
    
    constructor(initial: number) {
        this.value = initial
    }
    
    add(n: number): void {
        this.value = this.value + n
    }
    
    multiply(n: number): void {
        this.value = this.value * n
    }
    
    getResult(): number {
        return this.value
    }
    
    reset(): void {
        this.value = 0
    }
}

class Counter {
    count: number;
    
    constructor() {
        this.count = 0
    }
    
    increment(): void {
        this.count = this.count + 1
    }
    
    decrement(): void {
        this.count = this.count - 1
    }
    
    getCount(): number {
        return this.count
    }
}

export function testClasses() {
    console.log("Testing classes...")
    
    // Test 1: Basic class instantiation
    let calc = new Calculator(10)
    console.log("1: Initial value =", calc.getResult())
    
    // Test 2: Method calls
    calc.add(5)
    console.log("2: After add(5) =", calc.getResult())
    
    // Test 3: Multiple operations
    calc.multiply(2)
    console.log("3: After multiply(2) =", calc.getResult())
    
    // Test 4: Multiple instances
    let calc2 = new Calculator(100)
    calc2.add(50)
    console.log("4: calc2 =", calc2.getResult())
    
    // Test 5: Instance independence
    console.log("5: calc =", calc.getResult())
    console.log("5: calc2 =", calc2.getResult())
    
    // Test 6: Counter class
    let counter = new Counter()
    counter.increment()
    counter.increment()
    counter.increment()
    console.log("6: Counter after 3 increments =", counter.getCount())
    
    counter.decrement()
    console.log("6: Counter after decrement =", counter.getCount())
    
    // Test 7: Reset
    calc.reset()
    console.log("7: After reset =", calc.getResult())
    
    // Test 8: Chained operations
    let calc3 = new Calculator(1)
    calc3.add(2)
    calc3.multiply(3)
    calc3.add(4)
    console.log("8: Chained result =", calc3.getResult())
    
    console.log("Classes test passed")
}
