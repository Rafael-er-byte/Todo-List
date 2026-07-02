import ValueObject from '../../../../shared/core/objects/ValueObject';
import { AllowedProjectStatus } from '../types/AllowedProjectStatus';
export default class ProjectStatus extends ValueObject {
    private status;
    private constructor();
    static create(status: AllowedProjectStatus): ProjectStatus;
    static open(): ProjectStatus;
    static closed(): ProjectStatus;
    getStatus(): AllowedProjectStatus;
    isClosed(): boolean;
    isOpen(): boolean;
}
//# sourceMappingURL=ProjectStatus.d.ts.map