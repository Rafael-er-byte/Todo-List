import DomainEvent from '../../../shared/core/events/DomainEvent';
export default class TaskMarkedAsPending extends DomainEvent {
    constructor(key, date, actor, idProject, idEntity) {
        super(key, date, actor, idProject, idEntity, 'TASK_MARKED_AS_PENDING');
    }
}
//# sourceMappingURL=TaskMarkedAsPending.js.map