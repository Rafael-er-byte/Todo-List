import CoreError from '../../../../shared/core/errors/CoreError';

export default class ProjectSettingNotSupported extends CoreError {
  constructor(setting: string) {
    super('Project setting is not supported', { setting });
    Object.setPrototypeOf(this, ProjectSettingNotSupported.prototype);
  }
}
