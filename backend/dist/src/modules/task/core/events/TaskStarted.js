import DomainEvent from '../../../shared/core/events/DomainEvent';
import None from '../../../shared/core/objects/None';
export default class TaskStarted extends DomainEvent {
    constructor(key, date, idProject, idEntity) {
        super(key, date, new None(), idProject, idEntity, 'TASK_STARTED');
    }
}
//# sourceMappingURL=TaskStarted.js.map