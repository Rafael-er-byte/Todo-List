import DomainEvent from '../../../../shared/core/events/DomainEvent';
export default class ProjectBackgroundImageUpdated extends DomainEvent {
    constructor(key, date, actor, idProject, image) {
        super(key, date, actor, idProject, idProject, 'PROJECT_BACKGROUND_IMAGE_UPDATED', image);
    }
}
//# sourceMappingURL=ProjectBackgroundImageUpdated.js.map