import CoreError from '../../../shared/core/errors/CoreError';
export default class ProjectNeedsToBeClosedBeforeDeleteIt extends CoreError {
    constructor(projectId) {
        super('Project must be closed before being deleted', { projectId });
        Object.setPrototypeOf(this, ProjectNeedsToBeClosedBeforeDeleteIt.prototype);
    }
}
//# sourceMappingURL=ProjectNeedsToBeClosedBeforeDeleteIt.js.map