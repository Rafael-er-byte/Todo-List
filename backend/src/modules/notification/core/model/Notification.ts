import Entity from '../../../shared/core/model/Entity';
import DateTime from '../../../shared/core/objects/DateTime';
import DeletedAt from '../../../shared/core/objects/DeletedAt';
import IdEntity from '../../../shared/core/objects/IdEntity';
import NotificationCreated from '../events/NotificationCreated';
import NotificationRead from '../events/NotificationRead';
import NotificationAlreadyRead from '../error/NotificationAlreadyRead';
import type NotificationParams from '../interfaces/NotificationParams';
import IdNotification from '../objects/IdNotification';
import NotificationStatus from '../objects/NotificationStatus';

export default class Notification extends Entity {
  private eventKey!: string;
  private status!: NotificationStatus;

  private constructor(
    idNotification: IdNotification,
    eventKey: string,
    status: NotificationStatus,
    idUser: IdEntity,
  ) {
    super(idNotification, idUser);
    this.eventKey = eventKey;
    this.status = status;
  }

  public static create(
    key: string,
    idNotification: IdNotification,
    eventKey: string,
    idUser: IdEntity,
    actor: IdEntity,
  ): Notification {
    const notification = new Notification(idNotification, eventKey, NotificationStatus.unread(), idUser);
    notification.create();
    notification.addEvent(
      new NotificationCreated(key, DateTime.now(), actor, idUser, idNotification, notification.toPrimitives()),
    );
    return notification;
  }

  public static fromPrimitives(params: NotificationParams): Notification {
    const notification = new Notification(
      new IdNotification(params.id),
      params.eventKey,
      NotificationStatus.create(params.status),
      new IdEntity(params.idUser),
    );

    notification.build(
      DeletedAt.createFromPrimitive(params.deletedAt),
    );

    return notification;
  }

  public markAsRead(key: string, actor: IdEntity): void {
    if (this.status.isRead()) {
      throw new NotificationAlreadyRead({ idNotification: this.getId().getID() });
    }

    this.status = NotificationStatus.read();
    this.addEvent(
      new NotificationRead(key, DateTime.now(), actor, this.getIdUser(), this.getId(), this.status),
    );
  }

  public getId(): IdNotification {
    return super.getID() as IdNotification;
  }

  public getEventKey(): string {
    return this.eventKey;
  }

  public getStatus(): NotificationStatus {
    return this.status;
  }

  public getIdUser(): IdEntity {
    return super.getOwner() as IdEntity;
  }

  public toPrimitives(): NotificationParams {
    return {
      id: this.getId().getID(),
      eventKey: this.eventKey,
      status: this.status.getStatus(),
      idUser: this.getIdUser().getID(),
      deletedAt: super.getDeletedAt().toPrimitive(),
    };
  }
}
