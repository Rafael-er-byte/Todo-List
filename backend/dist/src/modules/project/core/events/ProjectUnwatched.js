import DomainEvent from '../../../shared/core/events/DomainEvent';
export default class ProjectUnwatched extends DomainEvent {
    constructor(key, date, actor, idProject) {
        super(key, date, actor, idProject, idProject, 'PROJECT_UNWATCHED');
    }
}
//# sourceMappingURL=ProjectUnwatched.js.map