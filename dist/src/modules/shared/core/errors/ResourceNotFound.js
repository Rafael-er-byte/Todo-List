import CoreError from './CoreError';
export default class ResourceNotFound extends CoreError {
    constructor(message, info) {
        super(message, info);
        Object.setPrototypeOf(this, ResourceNotFound.prototype);
    }
}
//# sourceMappingURL=ResourceNotFound.js.map