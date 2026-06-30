import InvalidParameters from '../../../shared/core/errors/InvalidParameters';
export default class InvalidUserSettingsKey extends InvalidParameters {
    constructor(setting) {
        super(`Invalid user settings key: ${setting}`);
        Object.setPrototypeOf(this, InvalidUserSettingsKey.prototype);
    }
}
//# sourceMappingURL=InvalidUserSettingsKey.js.map