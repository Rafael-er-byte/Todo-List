import CoreError from './CoreError';
export default class RelationshipAlreadyExists extends CoreError {
    constructor(message, info) {
        super(message, info);
        Object.setPrototypeOf(this, RelationshipAlreadyExists.prototype);
    }
}
//# sourceMappingURL=RelationshipAlreadyExists.js.map