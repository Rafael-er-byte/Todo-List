import DomainEvent from '../../../../shared/core/events/DomainEvent';
import type DateTime from '../../../../shared/core/objects/DateTime';
import type IdEntity from '../../../../shared/core/objects/IdEntity';
import type TaskTitle from '../objects/TaskTitle';

export default class TaskTitleUpdated extends DomainEvent {
  constructor(
    key: string,
    date: DateTime,
    actor: IdEntity,
    idProject: IdEntity,
    idEntity: IdEntity,
    newTitle: TaskTitle,
  ) {
    super(key, date, actor, idProject, idEntity, 'TASK_TITLE_UPDATED', newTitle);
  }
}
