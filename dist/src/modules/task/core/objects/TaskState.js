import ValueObject from '../../../shared/core/objects/ValueObject';
import TaskStateNotSupported from '../error/TaskStateNotSupported';
import { ALLOWED_TASK_STATE, AllowedTaskState } from '../types/AllowedTaskState';
export default class TaskState extends ValueObject {
    constructor(state) {
        super();
        if (!ALLOWED_TASK_STATE.includes(state))
            throw new TaskStateNotSupported(state);
        this.state = state;
    }
    static create(state) {
        return new TaskState(state);
    }
    static completed() {
        return new TaskState(AllowedTaskState.completed);
    }
    static pending() {
        return new TaskState(AllowedTaskState.pending);
    }
    getState() {
        return this.state;
    }
    isCompleted() {
        if (this.state === AllowedTaskState.completed)
            return true;
        return false;
    }
}
//# sourceMappingURL=TaskState.js.map