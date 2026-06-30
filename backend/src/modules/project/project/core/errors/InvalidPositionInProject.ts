import CoreError from '../../../../shared/core/errors/CoreError';

export default class InvalidPositionInProject extends CoreError {
  constructor(projectId: string) {
    super('Invalid position for the list in the project', { projectId });
    Object.setPrototypeOf(this, InvalidPositionInProject.prototype);
  }
}
