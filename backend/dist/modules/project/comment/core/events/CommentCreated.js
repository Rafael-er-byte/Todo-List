import DomainEvent from '../../../../shared/core/events/DomainEvent';
export default class CommentCreated extends DomainEvent {
    constructor(key, date, actor, idTask, idEntity, info) {
        const newInfo = { idTask, ...info };
        super(key, date, actor, idTask, idEntity, 'COMMENT_CREATED', newInfo);
    }
}
//# sourceMappingURL=CommentCreated.js.map