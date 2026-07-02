import DomainEvent from '../../../../shared/core/events/DomainEvent';
export default class ListMoved extends DomainEvent {
    constructor(key, date, actor, idProject, idEntity, newPosition) {
        super(key, date, actor, idProject, idEntity, 'LIST_MOVED', newPosition);
    }
}
//# sourceMappingURL=ListMoved.js.map