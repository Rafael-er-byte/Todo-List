import ValueObject from '../../../../shared/core/objects/ValueObject';
import TaskStateNotSupported from '../error/TaskStateNotSupported';
import { ALLOWED_TASK_STATE, AllowedTaskState } from '../types/AllowedTaskState';

export default class TaskState extends ValueObject {
  private state!: AllowedTaskState;

  private constructor(state: AllowedTaskState) {
    super();

    if (!ALLOWED_TASK_STATE.includes(state)) throw new TaskStateNotSupported(state);
    this.state = state;
  }

  public static create(state: AllowedTaskState): TaskState {
    return new TaskState(state);
  }

  public static completed(): TaskState {
    return new TaskState(AllowedTaskState.completed);
  }

  public static pending(): TaskState {
    return new TaskState(AllowedTaskState.pending);
  }

  public getState(): AllowedTaskState {
    return this.state;
  }

  public isCompleted(): boolean {
    if (this.state === AllowedTaskState.completed) return true;
    return false;
  }
}
