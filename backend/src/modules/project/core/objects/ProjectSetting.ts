import ValueObject from '../../../shared/core/objects/ValueObject';
import { ALLOWED_PROJECT_SETTING, type AllowedProjectSetting } from '../../../shared/core/types/AllowedProjectSetting';
import ProjectSettingNotSupported from '../errors/ProjectSettingNotSupported';

export default class ProjectSetting extends ValueObject {
  private setting!: AllowedProjectSetting;

  constructor(setting: AllowedProjectSetting) {
    super();
    if (!ALLOWED_PROJECT_SETTING.includes(setting)) throw new ProjectSettingNotSupported(setting);
    this.setting = setting;
  }

  public getSetting(): AllowedProjectSetting {
    return this.setting;
  }
}
