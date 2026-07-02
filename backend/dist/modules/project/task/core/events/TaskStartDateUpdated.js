import DomainEvent from '../../../../shared/core/events/DomainEvent';
export default class TaskBeginDateUpdated extends DomainEvent {
    constructor(key, date, actor, idProject, idEntity, newDate) {
        super(key, date, actor, idProject, idEntity, 'TASK_BEGIN_DATE_UPDATED', newDate);
    }
}
//# sourceMappingURL=TaskStartDateUpdated.js.map