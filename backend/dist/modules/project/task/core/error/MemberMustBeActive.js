import CoreError from '../../../../shared/core/errors/CoreError';
export default class MemberMustBeActive extends CoreError {
    constructor(info) {
        super('The member must be active', info);
        Object.setPrototypeOf(this, MemberMustBeActive.prototype);
    }
}
//# sourceMappingURL=MemberMustBeActive.js.map