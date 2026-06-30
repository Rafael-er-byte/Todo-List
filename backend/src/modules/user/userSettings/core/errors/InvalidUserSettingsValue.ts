import InvalidParameters from '../../../../shared/core/errors/InvalidParameters';

export default class InvalidUserSettingsValue extends InvalidParameters {
  constructor(setting: string) {
    super(`Invalid user settings value for: ${setting}`);
    Object.setPrototypeOf(this, InvalidUserSettingsValue.prototype);
  }
}
