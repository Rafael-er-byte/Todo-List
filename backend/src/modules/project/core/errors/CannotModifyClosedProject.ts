import CoreError from '../../../shared/core/errors/CoreError';

export default class CannotModifyClosedProject extends CoreError {
  constructor(projectId: string) {
    super('Cannot modify a closed project', { projectId });
    Object.setPrototypeOf(this, CannotModifyClosedProject.prototype);
  }
}
