import DomainEvent from '../../../../shared/core/events/DomainEvent';
export default class TaskMemberAdded extends DomainEvent {
    constructor(key, date, actor, idProject, idEntity, assigned) {
        super(key, date, actor, idProject, idEntity, 'TASK_MEMBER_ADDED', assigned);
    }
}
//# sourceMappingURL=TaskMemberAdded.js.map