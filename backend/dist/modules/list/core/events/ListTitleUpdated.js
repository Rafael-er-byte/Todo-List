import DomainEvent from '../../../shared/core/events/DomainEvent';
export default class ListTitleUpdated extends DomainEvent {
    constructor(key, date, actor, idProject, idEntity, newTitle) {
        super(key, date, actor, idProject, idEntity, 'LIST_TITLE_UPDATED', newTitle);
    }
}
//# sourceMappingURL=ListTitleUpdated.js.map