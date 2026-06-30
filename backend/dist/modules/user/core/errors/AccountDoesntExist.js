import CoreError from '../../../shared/core/errors/CoreError';
export default class AccountDoesntExist extends CoreError {
    constructor(info) {
        super('Account does not exist', info);
        Object.setPrototypeOf(this, AccountDoesntExist.prototype);
    }
}
//# sourceMappingURL=AccountDoesntExist.js.map