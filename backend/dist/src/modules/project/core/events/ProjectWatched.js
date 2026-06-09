import DomainEvent from '../../../shared/core/events/DomainEvent';
export default class ProjectWatched extends DomainEvent {
    constructor(key, date, actor, idProject) {
        super(key, date, actor, idProject, idProject, 'PROJECT_WATCHED');
    }
}
//# sourceMappingURL=ProjectWatched.js.map