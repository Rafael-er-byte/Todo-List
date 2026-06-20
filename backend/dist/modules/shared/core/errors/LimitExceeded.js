import CoreError from './CoreError';
export default class LimitExceeded extends CoreError {
    constructor(message, info) {
        super(message, info);
        Object.setPrototypeOf(this, LimitExceeded.prototype);
    }
}
//# sourceMappingURL=LimitExceeded.js.map