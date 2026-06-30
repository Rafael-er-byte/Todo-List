import DomainEvent from '../../../../shared/core/events/DomainEvent';
import type DateTime from '../../../../shared/core/objects/DateTime';
import type IdEntity from '../../../../shared/core/objects/IdEntity';

export default class TaskAttachmentDeleted extends DomainEvent {
  constructor(
    key: string,
    date: DateTime,
    actor: IdEntity,
    idTask: IdEntity,
    idEntity: IdEntity,
  ) {
    super(key, date, actor, idTask, idEntity, 'TASK_ATTACHMENT_DELETED');
  }
}
