import DomainEvent from '../../../../shared/core/events/DomainEvent';
export default class CategoryDeleted extends DomainEvent {
    constructor(key, date, actor, idProject, idEntity) {
        super(key, date, actor, idProject, idEntity, 'CATEGORY_DELETED');
    }
}
//# sourceMappingURL=CategoryDeleted.js.map