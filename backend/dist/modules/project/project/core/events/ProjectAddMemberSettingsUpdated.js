import DomainEvent from '../../../../shared/core/events/DomainEvent';
export default class ProjectAddMemberSettingsUpdated extends DomainEvent {
    constructor(key, date, actor, idProject, setting) {
        super(key, date, actor, idProject, idProject, 'PROJECT_ADD_MEMBER_SETTINGS_UPDATED', setting);
    }
}
//# sourceMappingURL=ProjectAddMemberSettingsUpdated.js.map