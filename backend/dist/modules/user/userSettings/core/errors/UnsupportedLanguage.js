import InvalidParameters from '../../../../shared/core/errors/InvalidParameters';
export default class UnsupportedLanguage extends InvalidParameters {
    constructor(language) {
        super(`Unsupported language: ${language}`);
        Object.setPrototypeOf(this, UnsupportedLanguage.prototype);
    }
}
//# sourceMappingURL=UnsupportedLanguage.js.map