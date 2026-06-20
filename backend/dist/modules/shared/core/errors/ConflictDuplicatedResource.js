import CoreError from './CoreError';
export default class ConflictDuplicateResource extends CoreError {
    constructor(message, info) {
        super(message, info);
        Object.setPrototypeOf(this, ConflictDuplicateResource.prototype);
    }
}
//# sourceMappingURL=ConflictDuplicatedResource.js.map