import DomainEvent from '../../../../shared/core/events/DomainEvent';
export default class ProjectNameUpdated extends DomainEvent {
    constructor(key, date, actor, idProject, newName) {
        super(key, date, actor, idProject, idProject, 'PROJECT_NAME_UPDATED', newName);
    }
}
//# sourceMappingURL=ProjectNameUpdated.js.map