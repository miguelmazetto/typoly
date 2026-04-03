// Type declarations for Typoly's extended RegExp class
interface RegExpMatchResult {
    value: string;
    index: number;
    groups: string[];
    length: number;
}

interface RegExp {
    test(str: string): boolean;
    exec(str: string): RegExpMatchResult | null;
    matchAll(str: string): RegExpMatchResult[];
    replace(str: string, replacement: string): string;
    split(str: string): string[];
    search(str: string): number;
    source: string;
    global: boolean;
    ignoreCase: boolean;
    multiline: boolean;
    lastIndex: number;
}
