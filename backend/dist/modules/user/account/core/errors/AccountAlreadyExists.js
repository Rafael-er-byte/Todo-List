import CoreError from '../../../../shared/core/errors/CoreError';
export default class AccountAlreadyExists extends CoreError {
    constructor(info) {
        super('Account already exists', info);
        Object.setPrototypeOf(this, AccountAlreadyExists.prototype);
    }
}
//# sourceMappingURL=AccountAlreadyExists.js.map