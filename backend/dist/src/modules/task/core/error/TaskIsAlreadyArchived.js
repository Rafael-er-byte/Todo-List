import CoreError from '../../../shared/core/errors/CoreError';
export default class TaskIsAlreadyArchived extends CoreError {
    constructor(info) {
        super('Task is already archived', info);
        Object.setPrototypeOf(this, TaskIsAlreadyArchived.prototype);
    }
}
//# sourceMappingURL=TaskIsAlreadyArchived.js.map