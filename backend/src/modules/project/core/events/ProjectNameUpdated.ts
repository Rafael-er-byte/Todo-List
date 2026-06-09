import DomainEvent from '../../../shared/core/events/DomainEvent';
import type DateTime from '../../../shared/core/objects/DateTime';
import type IdEntity from '../../../shared/core/objects/IdEntity';
import type ProjectId from '../objects/ProjectId';
import type ProjectName from '../objects/ProjectName';

export default class ProjectNameUpdated extends DomainEvent {
  constructor(key: string, date: DateTime, actor: IdEntity, idProject: ProjectId, newName: ProjectName) {
    super(key, date, actor, idProject, idProject, 'PROJECT_NAME_UPDATED', newName);
  }
}
