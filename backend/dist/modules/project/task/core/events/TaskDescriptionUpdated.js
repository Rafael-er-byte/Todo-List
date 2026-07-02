import DomainEvent from '../../../../shared/core/events/DomainEvent';
export default class TaskDescriptionUpdated extends DomainEvent {
    constructor(key, date, actor, idProject, idEntity, newDescription) {
        super(key, date, actor, idProject, idEntity, 'TASK_DESCRIPTION_UPDATED', newDescription);
    }
}
//# sourceMappingURL=TaskDescriptionUpdated.js.map