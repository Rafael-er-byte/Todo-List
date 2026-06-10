import DomainEvent from '../../../shared/core/events/DomainEvent';
import type DateTime from '../../../shared/core/objects/DateTime';
import type IdEntity from '../../../shared/core/objects/IdEntity';
import type ProjectBackGroundColor from '../objects/ProjectBackGroundColor';
import type ProjectId from '../objects/ProjectId';

export default class ProjectColorUpdated extends DomainEvent {
  constructor(key: string, date: DateTime, actor: IdEntity, idProject: ProjectId, color: ProjectBackGroundColor) {
    super(key, date, actor, idProject, idProject, 'PROJECT_COLOR_UPDATED', color);
  }
}
