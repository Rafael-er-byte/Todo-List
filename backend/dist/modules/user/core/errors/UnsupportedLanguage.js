import CoreError from '../../../shared/core/errors/CoreError';
export default class UnsupportedLanguage extends CoreError {
    constructor(info) {
        super('Unsupported language', info);
        Object.setPrototypeOf(this, UnsupportedLanguage.prototype);
    }
}
//# sourceMappingURL=UnsupportedLanguage.js.map