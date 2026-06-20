import CoreError from './CoreError';
export default class OperationNotAllowed extends CoreError {
    constructor(message, info) {
        super(message, info);
        Object.setPrototypeOf(this, OperationNotAllowed.prototype);
    }
}
//# sourceMappingURL=OperationNotAllowed.js.map