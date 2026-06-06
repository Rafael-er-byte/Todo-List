import DomainEvent from '../../../shared/core/events/DomainEvent';
import type DateTime from '../../../shared/core/objects/DateTime';
import type IdEntity from '../../../shared/core/objects/IdEntity';
import type NotificationStatus from '../objects/NotificationStatus';
export default class NotificationRead extends DomainEvent {
    constructor(key: string, date: DateTime, actor: IdEntity, idUser: IdEntity, idNotification: IdEntity, status: NotificationStatus);
}
//# sourceMappingURL=NotificationRead.d.ts.map