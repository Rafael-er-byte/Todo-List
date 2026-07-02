import DomainEvent from '../../../../shared/core/events/DomainEvent';
export default class MemberRoleChanged extends DomainEvent {
    constructor(key, date, actor, idProject, idEntity, newRole) {
        super(key, date, actor, idProject, idEntity, 'MEMBER_ROLE_CHANGED', newRole);
    }
}
//# sourceMappingURL=MemberRoleChanged.js.map