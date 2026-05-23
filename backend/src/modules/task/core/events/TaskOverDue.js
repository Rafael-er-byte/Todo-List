import DomainEvent from '../../../shared/core/events/DomainEvent';
import None from '../../../shared/core/objects/None';
export default class TaskOverDue extends DomainEvent {
    constructor(key, date, idProject, idEntity) {
        super(key, date, new None(), idProject, idEntity, 'TASK_OVERDUE');
    }
}
//# sourceMappingURL=TaskOverDue.js.map