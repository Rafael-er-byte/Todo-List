import DomainEvent from '../../../../shared/core/events/DomainEvent';
export default class TaskCategoryAdded extends DomainEvent {
    constructor(key, date, actor, idProject, idEntity, category) {
        super(key, date, actor, idProject, idEntity, 'TASK_CATEGORY_ADDED', category);
    }
}
//# sourceMappingURL=TaskCategoryAdded.js.map