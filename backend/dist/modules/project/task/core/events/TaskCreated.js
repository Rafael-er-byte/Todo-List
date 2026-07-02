import DomainEvent from '../../../../shared/core/events/DomainEvent';
export default class TaskCreated extends DomainEvent {
    constructor(key, date, actor, idProject, idEntity, taskParams) {
        super(key, date, actor, idProject, idEntity, 'TASK_CREATED', taskParams);
    }
}
//# sourceMappingURL=TaskCreated.js.map