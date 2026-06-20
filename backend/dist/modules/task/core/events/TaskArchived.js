import DomainEvent from '../../../shared/core/events/DomainEvent';
export default class TaskArchived extends DomainEvent {
    constructor(key, date, actor, idProject, idEntity) {
        super(key, date, actor, idProject, idEntity, 'TASK_ARCHIVED');
    }
}
//# sourceMappingURL=TaskArchived.js.map