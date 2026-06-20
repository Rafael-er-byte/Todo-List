import CoreError from '../../../shared/core/errors/CoreError';
export default class ProjectStatusNotSupported extends CoreError {
    constructor(status) {
        super('Project status is not supported', { status });
        Object.setPrototypeOf(this, ProjectStatusNotSupported.prototype);
    }
}
//# sourceMappingURL=ProjectStatusNotSupported.js.map