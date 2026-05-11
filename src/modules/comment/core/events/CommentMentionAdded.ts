import DomainEvent from '../../../shared/core/events/DomainEvent';
import type DateTime from '../../../shared/core/objects/DateTime';
import type IdEntity from '../../../shared/core/objects/IdEntity';

export default class CommentMentionAdded extends DomainEvent {
  constructor(
    key: string,
    date: DateTime,
    actor: IdEntity,
    idEntity: IdEntity,
    mentionedId: IdEntity
  ) {
    super(key, date, actor, actor, idEntity, 'COMMENT_MENTION_ADDED', mentionedId);
  }
}
