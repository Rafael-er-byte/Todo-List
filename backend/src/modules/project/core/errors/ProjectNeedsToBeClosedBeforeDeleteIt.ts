import CoreError from '../../../shared/core/errors/CoreError';

export default class ProjectNeedsToBeClosedBeforeDeleteIt extends CoreError {
  constructor(projectId: string) {
    super('Project must be closed before being deleted', { projectId });
    Object.setPrototypeOf(this, ProjectNeedsToBeClosedBeforeDeleteIt.prototype);
  }
}
