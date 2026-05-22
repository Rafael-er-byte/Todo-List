import DomainEvent from '../../../shared/core/events/DomainEvent';
export default class CategoryCreated extends DomainEvent {
    constructor(key, date, actor, idProject, idEntity) {
        super(key, date, actor, idProject, idEntity, 'CATEGORY_CREATED');
    }
}
//# sourceMappingURL=CategoryCreated.js.map