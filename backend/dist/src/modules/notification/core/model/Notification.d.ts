import Entity from '../../../shared/core/model/Entity';
import IdEntity from '../../../shared/core/objects/IdEntity';
import type NotificationParams from '../interfaces/NotificationParams';
import IdNotification from '../objects/IdNotification';
import NotificationStatus from '../objects/NotificationStatus';
export default class Notification extends Entity {
    private event;
    private status;
    private constructor();
    static create(key: string, idNotification: IdNotification, event: IdEntity, idUser: IdEntity, actor: IdEntity): Notification;
    static fromPrimitives(params: NotificationParams): Notification;
    markAsRead(key: string, actor: IdEntity): void;
    getId(): IdNotification;
    getEvent(): IdEntity;
    getStatus(): NotificationStatus;
    getIdUser(): IdEntity;
    toPrimitives(): NotificationParams;
}
//# sourceMappingURL=Notification.d.ts.map