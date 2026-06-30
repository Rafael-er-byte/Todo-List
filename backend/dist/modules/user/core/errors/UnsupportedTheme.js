import CoreError from '../../../shared/core/errors/CoreError';
export default class UnsupportedTheme extends CoreError {
    constructor(info) {
        super('Unsupported theme', info);
        Object.setPrototypeOf(this, UnsupportedTheme.prototype);
    }
}
//# sourceMappingURL=UnsupportedTheme.js.map