import DomainEvent from '../../../shared/core/events/DomainEvent';
import type DateTime from '../../../shared/core/objects/DateTime';
import type IdEntity from '../../../shared/core/objects/IdEntity';

export default class AccountChanged extends DomainEvent {
  constructor(
    key: string,
    date: DateTime,
    actor: IdEntity,
    ownerId: IdEntity,
    accountId: IdEntity,
    info?: unknown,
  ) {
    super(key, date, actor, ownerId, accountId, 'ACCOUNT_CHANGED', info);
  }
}
