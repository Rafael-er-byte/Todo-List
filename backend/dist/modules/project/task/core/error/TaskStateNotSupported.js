import CoreError from '../../../../shared/core/errors/CoreError';
export default class TaskStateNotSupported extends CoreError {
    constructor(info) {
        super('TaskStateNotSupported', info);
        Object.setPrototypeOf(this, TaskStateNotSupported.prototype);
    }
}
//# sourceMappingURL=TaskStateNotSupported.js.map