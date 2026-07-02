import DomainEvent from '../../../../shared/core/events/DomainEvent';
export default class MemberActived extends DomainEvent {
    constructor(key, date, actor, idProject, idEntity) {
        super(key, date, actor, idProject, idEntity, 'MEMBER_ACTIVED');
    }
}
//# sourceMappingURL=MemberActived.js.map