import CoreError from '../../../shared/core/errors/CoreError';
export default class NotificationAlreadyRead extends CoreError {
    constructor(info) {
        super('Notification has already been read', info);
        Object.setPrototypeOf(this, NotificationAlreadyRead.prototype);
    }
}
//# sourceMappingURL=NotificationAlreadyRead.js.map