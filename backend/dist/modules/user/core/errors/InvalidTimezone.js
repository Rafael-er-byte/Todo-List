import CoreError from '../../../shared/core/errors/CoreError';
export default class InvalidTimezone extends CoreError {
    constructor(info) {
        super('Invalid timezone', info);
        Object.setPrototypeOf(this, InvalidTimezone.prototype);
    }
}
//# sourceMappingURL=InvalidTimezone.js.map