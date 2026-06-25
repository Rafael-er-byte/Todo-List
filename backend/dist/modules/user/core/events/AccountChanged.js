import DomainEvent from '../../../shared/core/events/DomainEvent';
export default class AccountChanged extends DomainEvent {
    constructor(key, date, actor, ownerId, accountId, info) {
        super(key, date, actor, ownerId, accountId, 'ACCOUNT_CHANGED', info);
    }
}
//# sourceMappingURL=AccountChanged.js.map