import DomainEvent from '../../../shared/core/events/DomainEvent';
export default class ListUnarchived extends DomainEvent {
    constructor(key, date, actor, idProject, idEntity) {
        super(key, date, actor, idProject, idEntity, 'LIST_UNARCHIVED');
    }
}
//# sourceMappingURL=ListUnarchived.js.map