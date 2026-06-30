import ValueObject from '../../../shared/core/objects/ValueObject';
import { AllowedLanguage } from '../types/Language';
export default class Language extends ValueObject {
    private language;
    constructor(language: AllowedLanguage);
    getLanguage(): AllowedLanguage;
}
//# sourceMappingURL=Language.d.ts.map