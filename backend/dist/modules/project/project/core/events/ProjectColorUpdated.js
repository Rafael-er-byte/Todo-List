import DomainEvent from '../../../../shared/core/events/DomainEvent';
export default class ProjectColorUpdated extends DomainEvent {
    constructor(key, date, actor, idProject, color) {
        super(key, date, actor, idProject, idProject, 'PROJECT_COLOR_UPDATED', color);
    }
}
//# sourceMappingURL=ProjectColorUpdated.js.map