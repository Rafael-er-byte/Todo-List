import DomainEvent from '../../../shared/core/events/DomainEvent';
export default class CommentDeleted extends DomainEvent {
    constructor(key, date, actor, idTask, idEntity) {
        const info = { idTask };
        super(key, date, actor, idEntity, 'COMMENT_DELETED', info);
    }
}
//# sourceMappingURL=CommentDeleted.js.map