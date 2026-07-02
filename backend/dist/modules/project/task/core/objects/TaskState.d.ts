import ValueObject from '../../../../shared/core/objects/ValueObject';
import { AllowedTaskState } from '../types/AllowedTaskState';
export default class TaskState extends ValueObject {
    private state;
    private constructor();
    static create(state: AllowedTaskState): TaskState;
    static completed(): TaskState;
    static pending(): TaskState;
    getState(): AllowedTaskState;
    isCompleted(): boolean;
}
//# sourceMappingURL=TaskState.d.ts.map