import DomainEvent from '../../../shared/core/events/DomainEvent';
import type DateTime from '../../../shared/core/objects/DateTime';
import type IdEntity from '../../../shared/core/objects/IdEntity';
import type ProjectId from '../objects/ProjectId';
import type ProjectSetting from '../objects/ProjectSetting';
export default class ProjectCreateResourceSettingUpdated extends DomainEvent {
    constructor(key: string, date: DateTime, actor: IdEntity, idProject: ProjectId, setting: ProjectSetting);
}
//# sourceMappingURL=ProjectCreateResourceSettingUpdated.d.ts.map