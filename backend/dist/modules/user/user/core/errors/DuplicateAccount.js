import CoreError from '../../../../shared/core/errors/CoreError';
export default class DuplicateAccount extends CoreError {
    constructor(info) {
        super('Account already added to user', info);
        Object.setPrototypeOf(this, DuplicateAccount.prototype);
    }
}
//# sourceMappingURL=DuplicateAccount.js.map