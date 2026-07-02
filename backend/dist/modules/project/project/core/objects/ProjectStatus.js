import ValueObject from '../../../../shared/core/objects/ValueObject';
import ProjectStatusNotSupported from '../errors/ProjectStatusNotSupported';
import { ALLOWED_PROJECT_STATUS, AllowedProjectStatus } from '../types/AllowedProjectStatus';
export default class ProjectStatus extends ValueObject {
    constructor(status) {
        super();
        if (!ALLOWED_PROJECT_STATUS.includes(status))
            throw new ProjectStatusNotSupported(status);
        this.status = status;
    }
    static create(status) {
        return new ProjectStatus(status);
    }
    static open() {
        return new ProjectStatus(AllowedProjectStatus.open);
    }
    static closed() {
        return new ProjectStatus(AllowedProjectStatus.closed);
    }
    getStatus() {
        return this.status;
    }
    isClosed() {
        return this.status === AllowedProjectStatus.closed;
    }
    isOpen() {
        return this.status === AllowedProjectStatus.open;
    }
}
//# sourceMappingURL=ProjectStatus.js.map