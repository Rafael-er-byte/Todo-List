import DomainEvent from '../../../../shared/core/events/DomainEvent';
export default class NotificationRead extends DomainEvent {
    constructor(key, date, actor, idUser, idNotification, status) {
        super(key, date, actor, idUser, idNotification, 'NOTIFICATION_READ', status);
    }
}
//# sourceMappingURL=NotificationRead.js.map