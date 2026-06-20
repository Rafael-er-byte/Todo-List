import DomainEvent from '../../../shared/core/events/DomainEvent';
export default class ProjectCommentSettingsUpdated extends DomainEvent {
    constructor(key, date, actor, idProject, setting) {
        super(key, date, actor, idProject, idProject, 'PROJECT_COMMENT_SETTINGS_UPDATED', setting);
    }
}
//# sourceMappingURL=ProjectCommentSettingsUpdated.js.map