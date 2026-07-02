import CoreError from '../../../../shared/core/errors/CoreError';
export default class InvalidStartDate extends CoreError {
    constructor(info) {
        super('The start date is not valid', info);
        Object.setPrototypeOf(this, InvalidStartDate.prototype);
    }
}
//# sourceMappingURL=InvalidStartDateTime.js.map