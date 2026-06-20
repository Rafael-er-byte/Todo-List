import ValueObject from '../../../shared/core/objects/ValueObject';
import ProjectSettingNotSupported from '../errors/ProjectSettingNotSupported';
import { ALLOWED_PROJECT_SETTING, AllowedProjectSetting } from '../types/AllowedProjectSetting';
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