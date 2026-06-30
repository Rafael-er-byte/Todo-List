import InvalidParameters from '../../../../shared/core/errors/InvalidParameters';

export default class InvalidUserSettingsKey extends InvalidParameters {
  constructor(setting: string) {
    super(`Invalid user settings key: ${setting}`);
    Object.setPrototypeOf(this, InvalidUserSettingsKey.prototype);
  }
}
