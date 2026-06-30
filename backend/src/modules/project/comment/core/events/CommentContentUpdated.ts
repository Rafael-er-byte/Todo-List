import DomainEvent from '../../../../shared/core/events/DomainEvent';
import type DateTime from '../../../../shared/core/objects/DateTime';
import type IdEntity from '../../../../shared/core/objects/IdEntity';
import type Text from '../../../../shared/core/objects/Text';

export default class CommentContentUpdated extends DomainEvent {
  constructor(
    key: string,
    date: DateTime,
    actor: IdEntity,
    idEntity: IdEntity,
    idTask: IdEntity,
    content: Text
  ) {
    super(key, date, actor, idTask, idEntity, 'COMMENT_CONTENT_UPDATED', content);
  }
}
