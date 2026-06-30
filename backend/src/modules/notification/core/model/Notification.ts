import Entity from '../../../shared/core/model/Entity';
import DateTime from '../../../shared/core/objects/DateTime';
import IdEntity from '../../../shared/core/objects/IdEntity';
import NotificationCreated from '../events/NotificationCreated';
import NotificationRead from '../events/NotificationRead';
import NotificationAlreadyRead from '../error/NotificationAlreadyRead';
import type NotificationParams from '../interfaces/NotificationParams';
import IdNotification from '../objects/IdNotification';
import NotificationStatus from '../objects/NotificationStatus';
import type { NotificationTypes } from '../types/NotificationTypes';

export default class Notification extends Entity {
  private eventKey!: string;
  private status!: NotificationStatus;
  private type!: NotificationTypes;
  private idUser!: IdEntity;

  private constructor(
    idNotification: IdNotification,
    eventKey: string,
    status: NotificationStatus,
    type: NotificationTypes,
    idUser: IdEntity,
  ) {
    super(idNotification);
    this.idUser = idUser;
    this.eventKey = eventKey;
    this.status = status;
    this.type = type;
  }

  public static create(
    params: Omit<NotificationParams, 'status'> & { key: string; actor: string },
  ): Notification {
    const idNotification = new IdNotification(params.id);
    const idUser = new IdEntity(params.idUser);
    const actor = new IdEntity(params.actor);
    const type = params.type as NotificationTypes;
    const notification = new Notification(idNotification, params.eventKey, NotificationStatus.unread(), type, idUser);
    notification.addEvent(
      new NotificationCreated(params.key, DateTime.now(), actor, idUser, idNotification, notification.toPrimitives()),
    );
    return notification;
  }

  public static fromPrimitives(params: NotificationParams): Notification {
    const notification = new Notification(
      new IdNotification(params.id),
      params.eventKey,
      NotificationStatus.create(params.status),
      params.type as NotificationTypes, 
      new IdEntity(params.idUser),
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
    return this.idUser;
  }

  public getType(): NotificationTypes {
    return this.type;
  }

  public toPrimitives(): NotificationParams {
    return {
      id: this.getId().getID(),
      eventKey: this.eventKey,
      status: this.status.getStatus(),
      idUser: this.getIdUser().getID(),
      type: this.type,
    };
  }

}
