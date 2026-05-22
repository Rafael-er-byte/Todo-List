import CoreError from './CoreError';
export default class InvalidOperation extends CoreError {
    constructor(message, data) {
        super(message, data);
        Object.setPrototypeOf(this, InvalidOperation.prototype);
    }
}
//# sourceMappingURL=InvalidOperation.js.map