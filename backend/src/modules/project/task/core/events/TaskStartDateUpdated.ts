import DomainEvent from '../../../shared/events/DomainEvent';
import type DateTime from '../../../../shared/core/objects/DateTime';
import type IdEntity from '../../../../shared/core/objects/IdEntity';

export default class TaskBeginDateUpdated extends DomainEvent {
  constructor(
    key: string,
    date: DateTime,
    actor: IdEntity,
    idProject: IdEntity,
    idEntity: IdEntity,
    newDate: DateTime,
  ) {
    super(key, date, actor, idProject, idEntity, 'TASK_BEGIN_DATE_UPDATED', newDate);
  }
}
