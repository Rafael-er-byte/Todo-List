import ValueObject from '../../../shared/core/objects/ValueObject';
import { AllowedLanguage } from '../types/Language';
export default class Language extends ValueObject {
    private language;
    private constructor();
    static create(language: AllowedLanguage): Language;
    static es(): Language;
    static en(): Language;
    getLanguage(): AllowedLanguage;
    toPrimitives(): AllowedLanguage;
}
//# sourceMappingURL=Language.d.ts.map