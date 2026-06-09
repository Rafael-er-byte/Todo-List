import DomainEvent from '../../../shared/core/events/DomainEvent';
export default class ProjectUnmarkedAsFavorite extends DomainEvent {
    constructor(key, date, actor, idProject) {
        super(key, date, actor, idProject, idProject, 'PROJECT_UNMARKED_AS_FAVORITE');
    }
}
//# sourceMappingURL=ProjectUnmarkedAsFavorite.js.map