import DomainEvent from '../../../../shared/core/events/DomainEvent';
export default class ProjectCreateResourceSettingUpdated extends DomainEvent {
    constructor(key, date, actor, idProject, setting) {
        super(key, date, actor, idProject, idProject, 'PROJECT_CREATE_RESOURCE_SETTING_UPDATED', setting);
    }
}
//# sourceMappingURL=ProjectCreateResourceSettingUpdated.js.map