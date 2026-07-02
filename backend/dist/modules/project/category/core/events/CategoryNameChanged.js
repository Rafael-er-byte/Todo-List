import DomainEvent from '../../../../shared/core/events/DomainEvent';
export default class CategoryNameChanged extends DomainEvent {
    constructor(key, date, actor, idProject, idEntity, newName) {
        super(key, date, actor, idProject, idEntity, 'CATEGORY_NAME_CHANGED', newName);
    }
}
//# sourceMappingURL=CategoryNameChanged.js.map