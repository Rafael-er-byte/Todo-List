import CoreError from './CoreError';
export default class InvalidParameters extends CoreError {
    constructor(isInvalid, info) {
        super(isInvalid, info);
        Object.setPrototypeOf(this, InvalidParameters.prototype);
    }
}
//# sourceMappingURL=InvalidParameters.js.map