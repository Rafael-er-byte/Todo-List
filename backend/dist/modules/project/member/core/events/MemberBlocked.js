import DomainEvent from '../../../../shared/core/events/DomainEvent';
export default class MemberBlocked extends DomainEvent {
    constructor(key, date, actor, idProject, idEntity) {
        super(key, date, actor, idProject, idEntity, 'MEMBER_BLOCKED');
    }
}
//# sourceMappingURL=MemberBlocked.js.map