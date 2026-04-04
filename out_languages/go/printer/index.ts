import { ImportsMixin } from './mixins/imports';

// Inheritance chain:
// CPrinter -> GoPrinterBase -> DeclarationsMixin -> ExpressionsMixin -> StatementsMixin -> ImportsMixin -> GoPrinter

export class GoPrinter extends ImportsMixin {
    // GoPrinter inherits all functionality from the class hierarchy
}
