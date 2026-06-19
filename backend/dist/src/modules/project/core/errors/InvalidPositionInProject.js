import CoreError from '../../../shared/core/errors/CoreError';
export default class InvalidPositionInProject extends CoreError {
    constructor(projectId) {
        super('Invalid position for the list in the project', { projectId });
        Object.setPrototypeOf(this, InvalidPositionInProject.prototype);
    }
}
//# sourceMappingURL=InvalidPositionInProject.js.map