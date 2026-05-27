import CoreError from '../../../shared/core/errors/CoreError';
export default class CannotModifyArchivedList extends CoreError {
    constructor(info) {
        super('Cannot modify archived list', info);
        Object.setPrototypeOf(this, CannotModifyArchivedList.prototype);
    }
}
//# sourceMappingURL=CannotModifyArchivedList.js.map