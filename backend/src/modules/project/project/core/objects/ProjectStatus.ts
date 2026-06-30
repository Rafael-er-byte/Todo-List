import ValueObject from '../../../../shared/core/objects/ValueObject';
import ProjectStatusNotSupported from '../errors/ProjectStatusNotSupported';
import { ALLOWED_PROJECT_STATUS, AllowedProjectStatus } from '../types/AllowedProjectStatus';

export default class ProjectStatus extends ValueObject {
  private status!: AllowedProjectStatus;

  private constructor(status: AllowedProjectStatus) {
    super();
    if (!ALLOWED_PROJECT_STATUS.includes(status)) throw new ProjectStatusNotSupported(status);
    this.status = status;
  }

  public static create(status: AllowedProjectStatus): ProjectStatus {
    return new ProjectStatus(status);
  }

  public static open(): ProjectStatus {
    return new ProjectStatus(AllowedProjectStatus.open);
  }

  public static closed(): ProjectStatus {
    return new ProjectStatus(AllowedProjectStatus.closed);
  }

  public getStatus(): AllowedProjectStatus {
    return this.status;
  }

  public isClosed(): boolean {
    return this.status === AllowedProjectStatus.closed;
  }

  public isOpen(): boolean {
    return this.status === AllowedProjectStatus.open;
  }
}
