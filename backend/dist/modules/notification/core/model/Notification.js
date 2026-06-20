import Entity from '../../../shared/core/model/Entity';
import DateTime from '../../../shared/core/objects/DateTime';
import IdEntity from '../../../shared/core/objects/IdEntity';
import NotificationCreated from '../events/NotificationCreated';
import NotificationRead from '../events/NotificationRead';
import NotificationAlreadyRead from '../error/NotificationAlreadyRead';
import IdNotification from '../objects/IdNotification';
import NotificationStatus from '../objects/NotificationStatus';
export default class Notification extends Entity {
    constructor(idNotification, eventKey, status, type, idUser) {
        super(idNotification);
        this.idUser = idUser;
        this.eventKey = eventKey;
        this.status = status;
        this.type = type;
    }
    static create(key, idNotification, eventKey, idUser, actor, type) {
        const notification = new Notification(idNotification, eventKey, NotificationStatus.unread(), type, idUser);
        notification.addEvent(new NotificationCreated(key, DateTime.now(), actor, idUser, idNotification, notification.toPrimitives()));
        return notification;
    }
    static fromPrimitives(params) {
        const notification = new Notification(new IdNotification(params.id), params.eventKey, NotificationStatus.create(params.status), params.type, new IdEntity(params.idUser));
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
        return this.idUser;
    }
    getType() {
        return this.type;
    }
    toPrimitives() {
        return {
            id: this.getId().getID(),
            eventKey: this.eventKey,
            status: this.status.getStatus(),
            idUser: this.getIdUser().getID(),
            type: this.type,
        };
    }
}
//# sourceMappingURL=Notification.js.map