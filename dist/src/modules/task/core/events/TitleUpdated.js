import DomainEvent from '../../../shared/core/events/DomainEvent';
export default class TaskTitleUpdated extends DomainEvent {
    constructor(key, date, actor, idProject, idEntity, newTitle) {
        super(key, date, actor, idProject, idEntity, 'TASK_TITLE_UPDATED', newTitle);
    }
}
//# sourceMappingURL=TitleUpdated.js.map