import DomainEvent from '../../../shared/core/events/DomainEvent';
export default class TaskDueDateUpdated extends DomainEvent {
    constructor(key, date, actor, idProject, idEntity, newDate) {
        super(key, date, actor, idProject, idEntity, 'TASK_DUE_DATE_UPDATED', newDate);
    }
}
//# sourceMappingURL=TaskDueDateUpdated.js.map