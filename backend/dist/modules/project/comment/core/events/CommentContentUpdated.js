import DomainEvent from '../../../../shared/core/events/DomainEvent';
export default class CommentContentUpdated extends DomainEvent {
    constructor(key, date, actor, idEntity, idTask, content) {
        super(key, date, actor, idTask, idEntity, 'COMMENT_CONTENT_UPDATED', content);
    }
}
//# sourceMappingURL=CommentContentUpdated.js.map