import DomainEvent from '../../../../shared/core/events/DomainEvent';
import type DateTime from '../../../../shared/core/objects/DateTime';
import type IdEntity from '../../../../shared/core/objects/IdEntity';
import type ProjectId from '../objects/ProjectId';

export default class ProjectCompletedTasksVisibilityUpdated extends DomainEvent {
  constructor(key: string, date: DateTime, actor: IdEntity, idProject: ProjectId, showCompletedTasks: boolean) {
    super(key, date, actor, idProject, idProject, 'PROJECT_COMPLETED_TASKS_VISIBILITY_UPDATED', showCompletedTasks);
  }
}
