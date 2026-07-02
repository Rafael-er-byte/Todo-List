import ValueObject from '../../../../shared/core/objects/ValueObject';
import MemberStatusNotSupported from '../error/MemberStatusNotSupported';
import { ALLOWED_MEMBER_STATUS, AllowedMemberStatus } from '../types/AllowedMemberStatus';
export default class MemberStatus extends ValueObject {
    constructor(status) {
        super();
        if (!ALLOWED_MEMBER_STATUS.includes(status))
            throw new MemberStatusNotSupported(status);
        this.status = status;
    }
    static create(status) {
        return new MemberStatus(status);
    }
    static blocked() {
        return new MemberStatus(AllowedMemberStatus.blocked);
    }
    static active() {
        return new MemberStatus(AllowedMemberStatus.active);
    }
    getStatus() {
        return this.status;
    }
    isBlocked() {
        return this.status === ALLOWED_MEMBER_STATUS[0];
    }
}
//# sourceMappingURL=MemberStatus.js.map