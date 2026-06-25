import DomainEvent from '../../../shared/core/events/DomainEvent';
export default class AccountCreated extends DomainEvent {
    constructor(key, date, actor, ownerId, idEntity, params) {
        super(key, date, actor, ownerId, idEntity, 'ACCOUNT_CREATED', params);
    }
}
//# sourceMappingURL=AccountCreated.js.map