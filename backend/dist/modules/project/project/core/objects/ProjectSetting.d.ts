import ValueObject from '../../../../shared/core/objects/ValueObject';
import { type AllowedProjectSetting } from '../../../../shared/core/types/AllowedProjectSetting';
export default class ProjectSetting extends ValueObject {
    private setting;
    constructor(setting: AllowedProjectSetting);
    getSetting(): AllowedProjectSetting;
}
//# sourceMappingURL=ProjectSetting.d.ts.map