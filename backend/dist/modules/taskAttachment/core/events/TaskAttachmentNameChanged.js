import DomainEvent from '../../../shared/core/events/DomainEvent';
export default class TaskAttachmentNameChanged extends DomainEvent {
    constructor(key, date, actor, idTask, idEntity, newName) {
        super(key, date, actor, idTask, idEntity, 'TASK_ATTACHMENT_NAME_CHANGED', newName);
    }
}
//# sourceMappingURL=TaskAttachmentNameChanged.js.map