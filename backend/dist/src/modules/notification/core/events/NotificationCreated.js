import DomainEvent from '../../../shared/core/events/DomainEvent';
export default class NotificationCreated extends DomainEvent {
    constructor(key, date, actor, idUser, idNotification, info) {
        super(key, date, actor, idUser, idNotification, 'NOTIFICATION_CREATED', info);
    }
}
//# sourceMappingURL=NotificationCreated.js.map