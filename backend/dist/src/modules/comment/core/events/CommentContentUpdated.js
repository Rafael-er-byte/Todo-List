import DomainEvent from '../../../shared/core/events/DomainEvent';
export default class CommentContentUpdated extends DomainEvent {
    constructor(key, date, actor, idEntity, idTask, content) {
        const info = { idTask, content };
        super(key, date, actor, idEntity, 'COMMENT_CONTENT_UPDATED', info);
    }
}
//# sourceMappingURL=CommentContentUpdated.js.map