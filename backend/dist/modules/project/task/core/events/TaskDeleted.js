import DomainEvent from '../../../../shared/core/events/DomainEvent';
export default class TaskDeleted extends DomainEvent {
    constructor(key, date, actor, idProject, idEntity) {
        super(key, date, actor, idProject, idEntity, 'TASK_DELETED');
    }
}
//# sourceMappingURL=TaskDeleted.js.map