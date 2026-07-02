import DomainEvent from '../../../../shared/core/events/DomainEvent';
export default class ProjectDeleted extends DomainEvent {
    constructor(key, date, actor, idProject) {
        super(key, date, actor, idProject, idProject, 'PROJECT_DELETED');
    }
}
//# sourceMappingURL=ProjectDeleted.js.map