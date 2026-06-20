import DomainEvent from '../../../shared/core/events/DomainEvent';
export default class MemberAddedToProject extends DomainEvent {
    constructor(key, date, actor, idProject, idEntity, params) {
        super(key, date, actor, idProject, idEntity, 'MEMBER_ADDED_TO_PROJECT', params);
    }
}
//# sourceMappingURL=MemberAddedToProject.js.map