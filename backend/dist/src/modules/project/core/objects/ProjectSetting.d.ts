import ValueObject from '../../../shared/core/objects/ValueObject';
import { AllowedProjectSetting } from '../types/AllowedProjectSetting';
export default class ProjectSetting extends ValueObject {
    private setting;
    constructor(setting: AllowedProjectSetting);
    getSetting(): AllowedProjectSetting;
}
//# sourceMappingURL=ProjectSetting.d.ts.map