import IdEntity from '../../../../shared/core/objects/IdEntity';
import NotificationAlreadyRead from '../error/NotificationAlreadyRead';
import type NotificationParams from '../interfaces/NotificationParams';
import IdNotification from '../objects/IdNotification';
import NotificationStatus from '../objects/NotificationStatus';
import type { NotificationTypes } from '../types/NotificationTypes';
import Entity from '../../../../shared/core/model/Entity';

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
    params: Omit<NotificationParams, 'status'>,
  ): Notification {
    const idNotification = new IdNotification(params.id);
    const idUser = new IdEntity(params.idUser);
    const type = params.type as NotificationTypes;
    const notification = new Notification(idNotification, params.eventKey, NotificationStatus.unread(), type, idUser);
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

  public markAsRead(): void {
    if (this.status.isRead()) {
      throw new NotificationAlreadyRead({ idNotification: this.getId().toString() });
    }

    this.status = NotificationStatus.read();
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
      id: this.getId().toString(),
      eventKey: this.eventKey,
      status: this.status.getStatus(),
      idUser: this.getIdUser().toString(),
      type: this.type,
    };
  }
}
