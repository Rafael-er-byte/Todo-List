import DomainEvent from '../../../shared/core/events/DomainEvent';
export default class TaskAttachmentDeleted extends DomainEvent {
    constructor(key, date, actor, idTask, idEntity) {
        super(key, date, actor, idTask, idEntity, 'TASK_ATTACHMENT_DELETED');
    }
}
//# sourceMappingURL=TaskAttachmentDeleted.js.map