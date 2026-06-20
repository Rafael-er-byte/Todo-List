import DomainEvent from '../../../shared/core/events/DomainEvent';
export default class TaskUnarchived extends DomainEvent {
    constructor(key, date, actor, idProject, idEntity) {
        super(key, date, actor, idProject, idEntity, 'TASK_UNARCHIVED');
    }
}
//# sourceMappingURL=TaskUnarchived.js.map