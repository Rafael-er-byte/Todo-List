import InvalidParameters from '../../../../shared/core/errors/InvalidParameters';
export default class InvalidUserSettingsValue extends InvalidParameters {
    constructor(setting) {
        super(`Invalid user settings value for: ${setting}`);
        Object.setPrototypeOf(this, InvalidUserSettingsValue.prototype);
    }
}
//# sourceMappingURL=InvalidUserSettingsValue.js.map