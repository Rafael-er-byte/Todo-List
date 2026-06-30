import Entity from '../../../shared/core/model/Entity';
import IdEntity from '../../../shared/core/objects/IdEntity';
import type NotificationParams from '../interfaces/NotificationParams';
import IdNotification from '../objects/IdNotification';
import NotificationStatus from '../objects/NotificationStatus';
import type { NotificationTypes } from '../types/NotificationTypes';
export default class Notification extends Entity {
    private eventKey;
    private status;
    private type;
    private idUser;
    private constructor();
    static create(params: Omit<NotificationParams, 'status'> & {
        key: string;
        actor: string;
    }): Notification;
    static fromPrimitives(params: NotificationParams): Notification;
    markAsRead(key: string, actor: IdEntity): void;
    getId(): IdNotification;
    getEventKey(): string;
    getStatus(): NotificationStatus;
    getIdUser(): IdEntity;
    getType(): NotificationTypes;
    toPrimitives(): NotificationParams;
}
//# sourceMappingURL=Notification.d.ts.map