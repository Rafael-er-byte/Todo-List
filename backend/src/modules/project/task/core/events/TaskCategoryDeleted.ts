import DomainEvent from '../../../shared/events/DomainEvent';
import type DateTime from '../../../../shared/core/objects/DateTime';
import type IdEntity from '../../../../shared/core/objects/IdEntity';

export default class TaskCategoryDeleted extends DomainEvent {
  constructor(
    key: string,
    date: DateTime,
    actor: IdEntity,
    idProject: IdEntity,
    idEntity: IdEntity,
    category: IdEntity
  ) {
    super(key, date, actor, idProject, idEntity, 'TASK_CATEGORY_DELETED', category);
  }
}
