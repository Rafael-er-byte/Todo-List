import ValueObject from '../../../../shared/core/objects/ValueObject';
import NotificationStatusNotSupported from '../error/NotificationStatusNotSupported';
import { ALLOWED_NOTIFICATION_STATUS, AllowedNotificationStatus } from '../types/AllowedNotificationStatus';
export default class NotificationStatus extends ValueObject {
    constructor(status) {
        super();
        if (!ALLOWED_NOTIFICATION_STATUS.includes(status))
            throw new NotificationStatusNotSupported(status);
        this.status = status;
    }
    static create(status) {
        return new NotificationStatus(status);
    }
    static read() {
        return new NotificationStatus(AllowedNotificationStatus.read);
    }
    static unread() {
        return new NotificationStatus(AllowedNotificationStatus.unread);
    }
    getStatus() {
        return this.status;
    }
    isRead() {
        return this.status === AllowedNotificationStatus.read;
    }
    isUnread() {
        return this.status === AllowedNotificationStatus.unread;
    }
}
//# sourceMappingURL=NotificationStatus.js.map