import DomainEvent from '../../../../shared/core/events/DomainEvent';
export default class ListArchived extends DomainEvent {
    constructor(key, date, actor, idProject, idEntity) {
        super(key, date, actor, idProject, idEntity, 'LIST_ARCHIVED');
    }
}
//# sourceMappingURL=ListArchived.js.map