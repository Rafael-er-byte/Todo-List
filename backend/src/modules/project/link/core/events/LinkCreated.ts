import type IdEntity from '../../../../shared/core/objects/IdEntity';
import DomainEvent from '../../../shared/events/DomainEvent';
import DateTime from '../../../../shared/core/objects/DateTime';
import type LinkId from '../objects/LinkId';

export default class LinkCreated extends DomainEvent {
  constructor(
    key: string,
    date: DateTime,
    actor: IdEntity,
    idTask: IdEntity,
    idLink: LinkId,
    info: unknown,
  ) {
    super(key, date, actor, idTask, idLink, 'LINK_CREATED', info);
  }
}
