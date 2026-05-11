import CoreError from '../../../shared/core/errors/CoreError';

export default class TaskStateNotSupported extends CoreError {
  constructor(info?: unknown) {
    super('TaskStateNotSupported', info);
    Object.setPrototypeOf(this, TaskStateNotSupported.prototype);
  }
}
