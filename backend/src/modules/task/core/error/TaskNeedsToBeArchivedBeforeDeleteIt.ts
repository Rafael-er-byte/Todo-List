import CoreError from '../../../shared/core/errors/CoreError';

export default class TaskNeedsToBeArchivedBeforeDeleteIt extends CoreError {
  constructor(info?: unknown) {
    super('Task needs to be archived before delete it', info);
    Object.setPrototypeOf(this, TaskNeedsToBeArchivedBeforeDeleteIt.prototype);
  }
}
