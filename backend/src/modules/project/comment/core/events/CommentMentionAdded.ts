import DomainEvent from '../../../shared/events/DomainEvent';
import type DateTime from '../../../../shared/core/objects/DateTime';
import type IdEntity from '../../../../shared/core/objects/IdEntity';

export default class CommentMentionAdded extends DomainEvent {
  constructor(
    key: string,
    date: DateTime,
    actor: IdEntity,
    idEntity: IdEntity,
    idTask: IdEntity,
    mentionedId: IdEntity
  ) {
    super(key, date, actor, idTask, idEntity, 'COMMENT_MENTION_ADDED', mentionedId);
  }
}
