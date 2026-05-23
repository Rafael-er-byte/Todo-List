import DomainEvent from '../../../shared/core/events/DomainEvent';
export default class MemberDeleted extends DomainEvent {
    constructor(key, date, actor, idProject, idEntity) {
        super(key, date, actor, idProject, idEntity, 'MEMBER_DELETED');
    }
}
//# sourceMappingURL=MemberDeleted.js.map