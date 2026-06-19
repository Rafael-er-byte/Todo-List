import DomainEvent from '../../../shared/core/events/DomainEvent';
export default class CommentDeleted extends DomainEvent {
    constructor(key, date, actor, idTask, idEntity) {
        super(key, date, actor, idTask, idEntity, 'COMMENT_DELETED');
    }
}
//# sourceMappingURL=CommentDeleted.js.map