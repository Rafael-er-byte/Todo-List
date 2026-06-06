import ValueObject from '../../../shared/core/objects/ValueObject';
import NotificationStatusNotSupported from '../error/NotificationStatusNotSupported';
import { ALLOWED_NOTIFICATION_STATUS, AllowedNotificationStatus } from '../types/AllowedNotificationStatus';

export default class NotificationStatus extends ValueObject {
  private status!: AllowedNotificationStatus;

  private constructor(status: AllowedNotificationStatus) {
    super();
    if (!ALLOWED_NOTIFICATION_STATUS.includes(status)) throw new NotificationStatusNotSupported(status);
    this.status = status;
  }

  public static create(status: AllowedNotificationStatus): NotificationStatus {
    return new NotificationStatus(status);
  }

  public static read(): NotificationStatus {
    return new NotificationStatus(AllowedNotificationStatus.read);
  }

  public static unread(): NotificationStatus {
    return new NotificationStatus(AllowedNotificationStatus.unread);
  }

  public getStatus(): AllowedNotificationStatus {
    return this.status;
  }

  public isRead(): boolean {
    return this.status === AllowedNotificationStatus.read;
  }

  public isUnread(): boolean {
    return this.status === AllowedNotificationStatus.unread;
  }
}
