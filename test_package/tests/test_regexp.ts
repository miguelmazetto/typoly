// Test: Regular Expressions
// Tests actual RegExp class from the stdlib

export function testRegExp() {
    console.log("Testing RegExp...")
    
    // Test 1: Basic pattern matching with RegExp
    let re1 = new RegExp("Hello")
    let str1 = "Hello World 123"
    let match1 = re1.test(str1)
    console.log("1: /Hello/.test('Hello World 123') =", match1)
    
    // Test 2: RegExp with flags (global)
    let re2 = new RegExp("o", "g")
    let matches = re2.matchAll(str1)
    console.log("2: /o/g matchAll count =", matches.length)
    
    // Test 3: RegExp with capture groups
    let re3 = new RegExp("stu(ff)?", "g")
    let str3 = "stuff and more stuff here"
    let allMatches = re3.matchAll(str3)
    console.log("3: /stu(ff)?/g matchAll count =", allMatches.length)
    if (allMatches.length > 0) {
        let first = allMatches[0]
        console.log("3: First match =", first.value)
        console.log("3: First match groups =", first.groups.length)
    }
    
    // Test 4: RegExp exec - returns optional MatchResult
    let re4 = new RegExp("(\\d+)-(\\d+)")
    let str4 = "Call 123-456-7890"
    let execResult: any = re4.exec(str4)
    if (execResult.value) {
        let match = execResult.value
        console.log("4: exec match =", match.value)
        console.log("4: exec groups =", match.groups.length)
        if (match.groups.length > 0) {
            console.log("4: First group =", match.groups[0])
        }
    }
    
    // Test 5: RegExp replace (global)
    let re5 = new RegExp("the", "g")
    let str5 = "the quick brown the fox"
    let replaced = re5.replace(str5, "a")
    console.log("5: /the/g replace =", replaced)
    
    // Test 6: RegExp replace (non-global)
    let re6 = new RegExp("the")
    let replaced6 = re6.replace(str5, "a")
    console.log("6: /the/ replace (first only) =", replaced6)
    
    // Test 7: RegExp split
    let re7 = new RegExp("[,;\\s]+")
    let str7 = "one,two;three four"
    let parts = re7.split(str7)
    console.log("7: split by /[,;\\s]+/ count =", parts.length)
    
    // Test 8: RegExp search
    let re8 = new RegExp("\\d+")
    let str8 = "abc123def"
    let searchIdx = re8.search(str8)
    console.log("8: /\\d+/.search index =", searchIdx)
    
    // Test 9: RegExp with ignoreCase
    let re9 = new RegExp("hello", "i")
    let str9 = "HELLO world"
    let match9 = re9.test(str9)
    console.log("9: /hello/i.test('HELLO world') =", match9)
    
    // Test 10: String.match with RegExp-like pattern
    let re10 = new RegExp("\\w+@\\w+\\.\\w+")
    let email = "test@example.com"
    let emailMatch = re10.test(email)
    console.log("10: Email pattern match =", emailMatch)
    
    // Test 11: Complex pattern with quantifiers
    let re11 = new RegExp("a{2,4}")
    let str11 = "aa aaa aaaa aaaaa"
    let match11 = re11.test(str11)
    console.log("11: /a{2,4}/.test =", match11)
    
    // Test 12: Character classes
    let re12 = new RegExp("[aeiou]+")
    let str12 = "hello world"
    let vowels = re12.matchAll(str12)
    console.log("12: /[aeiou]+/ matchAll count =", vowels.length)
    
    // Test 13: Anchors
    let re13 = new RegExp("^start")
    let str13a = "start here"
    let str13b = "not start"
    console.log("13: /^start/.test('start here') =", re13.test(str13a))
    console.log("13: /^start/.test('not start') =", re13.test(str13b))
    
    // Test 14: End anchor
    let re14 = new RegExp("end$")
    let str14a = "the end"
    let str14b = "end here"
    console.log("14: /end$/.test('the end') =", re14.test(str14a))
    console.log("14: /end$/.test('end here') =", re14.test(str14b))
    
    console.log("RegExp test passed")
}
