import DomainEvent from '../../../../shared/core/events/DomainEvent';
export default class ProjectCreated extends DomainEvent {
    constructor(key, date, actor, idProject, projectParams) {
        super(key, date, actor, idProject, idProject, 'PROJECT_CREATED', projectParams);
    }
}
//# sourceMappingURL=ProjectCreated.js.map