import DomainEvent from '../../../shared/core/events/DomainEvent';
export default class TaskFinished extends DomainEvent {
    constructor(key, date, actor, idProject, idEntity) {
        super(key, date, actor, idProject, idEntity, 'TASK_FINISHED');
    }
}
//# sourceMappingURL=TaskFinished.js.map