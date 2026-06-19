import DomainEvent from '../../../shared/core/events/DomainEvent';
export default class CommentMentionAdded extends DomainEvent {
    constructor(key, date, actor, idEntity, idTask, mentionedId) {
        const info = { idTask, mentionedId };
        super(key, date, actor, idEntity, 'COMMENT_MENTION_ADDED', info);
    }
}
//# sourceMappingURL=CommentMentionAdded.js.map