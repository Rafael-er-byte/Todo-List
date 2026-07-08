import DomainEvent from '../../../../shared/core/events/DomainEvent';
import type DateTime from '../../../../shared/core/objects/DateTime';
import type IdEntity from '../../../../shared/core/objects/IdEntity';

export default class NotificationCreated extends DomainEvent {
  constructor(
    key: string,
    date: DateTime,
    actor: IdEntity,
    idUser: IdEntity,
    idNotification: IdEntity,
    info?: unknown,
  ) {
    super(key, date, actor, idUser, idNotification, 'NOTIFICATION_CREATED', info);
  }
}
