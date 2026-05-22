import CoreError from '../../../shared/core/errors/CoreError';
export default class MemberStatusNotSupported extends CoreError {
    constructor(info) {
        super('Member status not supported', info);
        Object.setPrototypeOf(this, MemberStatusNotSupported.prototype);
    }
}
//# sourceMappingURL=MemberStatusNotSupported.js.map