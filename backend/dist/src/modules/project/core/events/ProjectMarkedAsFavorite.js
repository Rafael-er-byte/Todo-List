import DomainEvent from '../../../shared/core/events/DomainEvent';
export default class ProjectMarkedAsFavorite extends DomainEvent {
    constructor(key, date, actor, idProject) {
        super(key, date, actor, idProject, idProject, 'PROJECT_MARKED_AS_FAVORITE');
    }
}
//# sourceMappingURL=ProjectMarkedAsFavorite.js.map