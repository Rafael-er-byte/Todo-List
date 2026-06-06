import CoreError from '../../../shared/core/errors/CoreError';

export default class NotificationStatusNotSupported extends CoreError {
  constructor(info?: unknown) {
    super('Notification status not supported', info);
    Object.setPrototypeOf(this, NotificationStatusNotSupported.prototype);
  }
}
