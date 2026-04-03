import { GoPrinterBase } from './base';
import { DeclarationsMixin } from './mixins/declarations';
import { ExpressionsMixin } from './mixins/expressions';
import { StatementsMixin } from './mixins/statements';
import { ImportsMixin } from './mixins/imports';

// Diamond inheritance: Combine all mixins
// base.ts provides common utilities
// mixins/declarations.ts provides struct, function, interface, enum, etc.
// mixins/expressions.ts provides binary, call, property access, etc.
// mixins/statements.ts provides if, while, for, try, switch, etc.
// mixins/imports.ts provides import/export handling and source file emission

class DeclarationsMixinClass extends DeclarationsMixin(GoPrinterBase) {}
class ExpressionsMixinClass extends ExpressionsMixin(DeclarationsMixinClass) {}
class StatementsMixinClass extends StatementsMixin(ExpressionsMixinClass) {}
class ImportsMixinClass extends ImportsMixin(StatementsMixinClass) {}

export class GoPrinter extends ImportsMixinClass {
    // GoPrinter inherits all functionality from the mixins
}
