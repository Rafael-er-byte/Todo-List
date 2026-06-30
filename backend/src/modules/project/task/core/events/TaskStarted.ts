import DomainEvent from '../../../../shared/core/events/DomainEvent';
import type DateTime from '../../../../shared/core/objects/DateTime';
import type IdEntity from '../../../../shared/core/objects/IdEntity';
import None from '../../../../shared/core/objects/None';

export default class TaskStarted extends DomainEvent {
  constructor(
    key: string,
    date: DateTime,
    idProject: IdEntity,
    idEntity: IdEntity
  ) {
    super(key, date, new None(), idProject, idEntity, 'TASK_STARTED');
  }
}
