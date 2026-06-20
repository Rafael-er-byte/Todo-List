import CoreError from '../../../shared/core/errors/CoreError';

export default class CannotModifyClosedProject extends CoreError {
  constructor(projectId: string) {
    super('The project is closed and can not be modified', { projectId });
    Object.setPrototypeOf(this, CannotModifyClosedProject.prototype);
  }
}
