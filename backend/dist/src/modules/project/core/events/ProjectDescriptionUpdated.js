import DomainEvent from '../../../shared/core/events/DomainEvent';
export default class ProjectDescriptionUpdated extends DomainEvent {
    constructor(key, date, actor, idProject, newDescription) {
        super(key, date, actor, idProject, idProject, 'PROJECT_DESCRIPTION_UPDATED', newDescription);
    }
}
//# sourceMappingURL=ProjectDescriptionUpdated.js.map