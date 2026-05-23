import CoreError from './CoreError';
export default class Unauthorized extends CoreError {
    constructor(message, info) {
        super(message, info);
        Object.setPrototypeOf(this, Unauthorized.prototype);
    }
}
//# sourceMappingURL=Unauthorized.js.map