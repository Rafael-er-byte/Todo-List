import CoreError from '../../../shared/core/errors/CoreError';
export default class CannotModifyArchivedTasks extends CoreError {
    constructor(info) {
        super('Cannot modify archived tasks', info);
        Object.setPrototypeOf(this, CannotModifyArchivedTasks.prototype);
    }
}
//# sourceMappingURL=CannotModifyArchivedTasks.js.map