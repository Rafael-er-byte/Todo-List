import ValueObject from '../../../shared/core/objects/ValueObject';
import { AllowedNotificationStatus } from '../types/AllowedNotificationStatus';
export default class NotificationStatus extends ValueObject {
    private status;
    private constructor();
    static create(status: AllowedNotificationStatus): NotificationStatus;
    static read(): NotificationStatus;
    static unread(): NotificationStatus;
    getStatus(): AllowedNotificationStatus;
    isRead(): boolean;
    isUnread(): boolean;
}
//# sourceMappingURL=NotificationStatus.d.ts.map