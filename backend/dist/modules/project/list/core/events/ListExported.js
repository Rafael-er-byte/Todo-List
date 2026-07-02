import DomainEvent from '../../../../shared/core/events/DomainEvent';
export default class ListExported extends DomainEvent {
    constructor(key, date, actor, newProject, idEntity, newPosition) {
        super(key, date, actor, newProject, idEntity, 'LIST_EXPORTED', newPosition);
    }
}
//# sourceMappingURL=ListExported.js.map