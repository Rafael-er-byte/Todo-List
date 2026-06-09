import Entity from '../../../shared/core/model/Entity';
import DateTime from '../../../shared/core/objects/DateTime';
import DeletedAt from '../../../shared/core/objects/DeletedAt';
import IdEntity from '../../../shared/core/objects/IdEntity';
import Version from '../../../shared/core/objects/Version';
import NotificationCreated from '../events/NotificationCreated';
import NotificationRead from '../events/NotificationRead';
import NotificationAlreadyRead from '../error/NotificationAlreadyRead';
import IdNotification from '../objects/IdNotification';
import NotificationStatus from '../objects/NotificationStatus';
export default class Notification extends Entity {
    constructor(idNotification, eventKey, status, idUser) {
        super(idNotification, idUser);
        this.eventKey = eventKey;
        this.status = status;
    }
    static create(key, idNotification, eventKey, idUser, actor) {
        const notification = new Notification(idNotification, eventKey, NotificationStatus.unread(), idUser);
        notification.create();
        notification.addEvent(new NotificationCreated(key, DateTime.now(), actor, idUser, idNotification, notification.toPrimitives()));
        return notification;
    }
    static fromPrimitives(params) {
        const notification = new Notification(new IdNotification(params.id), params.eventKey, NotificationStatus.create(params.status), new IdEntity(params.idUser));
        notification.build(new Version(params.version), DeletedAt.createFromPrimitive(params.deletedAt));
        return notification;
    }
    markAsRead(key, actor) {
        if (this.status.isRead()) {
            throw new NotificationAlreadyRead({ idNotification: this.getId().getID() });
        }
        this.status = NotificationStatus.read();
        this.addEvent(new NotificationRead(key, DateTime.now(), actor, this.getIdUser(), this.getId(), this.status));
    }
    getId() {
        return super.getID();
    }
    getEventKey() {
        return this.eventKey;
    }
    getStatus() {
        return this.status;
    }
    getIdUser() {
        return super.getOwner();
    }
    toPrimitives() {
        return {
            id: this.getId().getID(),
            eventKey: this.eventKey,
            status: this.status.getStatus(),
            idUser: this.getIdUser().getID(),
            version: super.getVersion().valueOf(),
            deletedAt: super.getDeletedAt().toPrimitive(),
        };
    }
}
//# sourceMappingURL=Notification.js.map