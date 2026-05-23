import CoreError from '../../../shared/core/errors/CoreError';
export default class CategoryColorNotSupported extends CoreError {
    constructor(info) {
        super('CategoryColorNotSupported', info);
        Object.setPrototypeOf(this, CategoryColorNotSupported.prototype);
    }
}
//# sourceMappingURL=CategoryColorNotSupported.js.map