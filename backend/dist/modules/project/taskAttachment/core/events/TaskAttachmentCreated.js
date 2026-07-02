import DomainEvent from '../../../../shared/core/events/DomainEvent';
export default class TaskAttachmentCreated extends DomainEvent {
    constructor(key, date, actor, idTask, idEntity, attachment) {
        super(key, date, actor, idTask, idEntity, 'TASK_ATTACHMENT_CREATED', attachment);
    }
}
//# sourceMappingURL=TaskAttachmentCreated.js.map