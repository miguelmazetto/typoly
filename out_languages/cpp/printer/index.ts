import { ImportsMixin } from './mixins/imports';

// Inheritance chain:
// RawTypescriptPrinter -> CppPrinterBase -> DeclarationsMixin -> ExpressionsMixin -> StatementsMixin -> ImportsMixin -> CppPrinter

export class CppPrinter extends ImportsMixin {
    // CppPrinter inherits all functionality from the class hierarchy
}
