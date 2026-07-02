import DomainEvent from '../../../../shared/core/events/DomainEvent';
export default class ListDeleted extends DomainEvent {
    constructor(key, date, actor, idProject, idEntity) {
        super(key, date, actor, idProject, idEntity, 'LIST_DELETED');
    }
}
//# sourceMappingURL=ListDeleted.js.map