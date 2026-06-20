import DomainEvent from '../../../shared/core/events/DomainEvent';
export default class ProjectCompletedTasksVisibilityUpdated extends DomainEvent {
    constructor(key, date, actor, idProject, showCompletedTasks) {
        super(key, date, actor, idProject, idProject, 'PROJECT_COMPLETED_TASKS_VISIBILITY_UPDATED', showCompletedTasks);
    }
}
//# sourceMappingURL=ProjectCompletedTasksVisibilityUpdated.js.map