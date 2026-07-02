import DomainEvent from '../../../../shared/core/events/DomainEvent';
export default class TaskMemberDeleted extends DomainEvent {
    constructor(key, date, actor, idProject, idEntity, assigned) {
        super(key, date, actor, idProject, idEntity, 'TASK_MEMBER_DELETED', assigned);
    }
}
//# sourceMappingURL=TaskMemberDeleted.js.map