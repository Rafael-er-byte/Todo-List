import ValueObject from '../../../../shared/core/objects/ValueObject';
import { ALLOWED_PROJECT_SETTING } from '../../../../shared/core/types/AllowedProjectSetting';
import ProjectSettingNotSupported from '../errors/ProjectSettingNotSupported';
export default class ProjectSetting extends ValueObject {
    constructor(setting) {
        super();
        if (!ALLOWED_PROJECT_SETTING.includes(setting))
            throw new ProjectSettingNotSupported(setting);
        this.setting = setting;
    }
    getSetting() {
        return this.setting;
    }
}
//# sourceMappingURL=ProjectSetting.js.map