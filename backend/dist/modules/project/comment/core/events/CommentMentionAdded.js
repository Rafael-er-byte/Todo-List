import DomainEvent from '../../../../shared/core/events/DomainEvent';
export default class CommentMentionAdded extends DomainEvent {
    constructor(key, date, actor, idEntity, idTask, mentionedId) {
        super(key, date, actor, idTask, idEntity, 'COMMENT_MENTION_ADDED', mentionedId);
    }
}
//# sourceMappingURL=CommentMentionAdded.js.map