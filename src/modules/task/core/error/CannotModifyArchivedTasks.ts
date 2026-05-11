import CoreError from '../../../shared/core/errors/CoreError';

export default class CannotModifyArchivedTasks extends CoreError {
  constructor(info?: unknown) {
    super('Cannot modify archived tasks', info);
    Object.setPrototypeOf(this, CannotModifyArchivedTasks.prototype);
  }
}
