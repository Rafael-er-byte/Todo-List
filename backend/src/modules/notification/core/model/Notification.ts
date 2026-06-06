import Entity from '../../../shared/core/model/Entity';
import DateTime from '../../../shared/core/objects/DateTime';
import DeletedAt from '../../../shared/core/objects/DeletedAt';
import IdEntity from '../../../shared/core/objects/IdEntity';
import Version from '../../../shared/core/objects/Version';
import NotificationCreated from '../events/NotificationCreated';
import NotificationRead from '../events/NotificationRead';
import NotificationAlreadyRead from '../error/NotificationAlreadyRead';
import type NotificationParams from '../interfaces/NotificationParams';
import IdNotification from '../objects/IdNotification';
import NotificationStatus from '../objects/NotificationStatus';

export default class Notification extends Entity {
  private event!: IdEntity;
  private status!: NotificationStatus;

  private constructor(
    idNotification: IdNotification,
    event: IdEntity,
    status: NotificationStatus,
    idUser: IdEntity,
  ) {
    super(idNotification, idUser);
    this.event = event;
    this.status = status;
  }

  public static create(
    key: string,
    idNotification: IdNotification,
    event: IdEntity,
    idUser: IdEntity,
    actor: IdEntity,
  ): Notification {
    const notification = new Notification(idNotification, event, NotificationStatus.unread(), idUser);
    notification.create();
    notification.addEvent(
      new NotificationCreated(key, DateTime.now(), actor, idUser, idNotification, notification.toPrimitives()),
    );
    return notification;
  }

  public static fromPrimitives(params: NotificationParams): Notification {
    const notification = new Notification(
      new IdNotification(params.id),
      new IdEntity(params.event),
      NotificationStatus.create(params.status),
      new IdEntity(params.idUser),
    );

    notification.build(
      new Version(params.version),
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

  public getEvent(): IdEntity {
    return this.event;
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
      event: this.event.getID(),
      status: this.status.getStatus(),
      idUser: this.getIdUser().getID(),
      version: super.getVersion().valueOf(),
      deletedAt: super.getDeletedAt().toPrimitive(),
    };
  }
}
