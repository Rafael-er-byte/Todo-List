import CoreError from './CoreError';
export default class InvalidFormat extends CoreError {
    constructor(message, data) {
        super(message, data);
        Object.setPrototypeOf(this, InvalidFormat.prototype);
    }
}
//# sourceMappingURL=InvalidFormat.js.map