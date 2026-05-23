import DomainEvent from '../../../shared/core/events/DomainEvent';
export default class CommentCreated extends DomainEvent {
    constructor(key, date, actor, idEntity, idTask, info) {
        super(key, date, actor, idTask, idEntity, 'COMMENT_CREATED', info);
    }
}
//# sourceMappingURL=CommentCreated.js.map