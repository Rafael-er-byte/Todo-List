import DomainEvent from '../../../../shared/core/events/DomainEvent';
export default class TaskCategoryDeleted extends DomainEvent {
    constructor(key, date, actor, idProject, idEntity, category) {
        super(key, date, actor, idProject, idEntity, 'TASK_CATEGORY_DELETED', category);
    }
}
//# sourceMappingURL=TaskCategoryDeleted.js.map