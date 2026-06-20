import DomainEvent from '../../../shared/core/events/DomainEvent';
export default class ProjectClosed extends DomainEvent {
    constructor(key, date, actor, idProject) {
        super(key, date, actor, idProject, idProject, 'PROJECT_CLOSED');
    }
}
//# sourceMappingURL=ProjectClosed.js.map