import { RawTypescriptPrinter } from './ts_printer';
import type { EmitterExtraContext } from './emitter_extra';

export class TypolyBasePrinter extends RawTypescriptPrinter {
    constructor(printerOptions: any = {}, handlers: any = {}, extra: EmitterExtraContext) {
        super(printerOptions, handlers, extra);
    }
}
