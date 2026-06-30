import ValueObject from '../../../shared/core/objects/ValueObject';
import { ALLOWED_MEMBER_ROLES } from '../../../shared/core/types/AllowedMemberRoles';
import MemberRoleNotValid from '../error/MemberRoleNotValid';
export default class MemberRole extends ValueObject {
    constructor(role) {
        super();
        if (!ALLOWED_MEMBER_ROLES.includes(role))
            throw new MemberRoleNotValid(role);
        this.role = role;
    }
    getRole() {
        return this.role;
    }
}
//# sourceMappingURL=MemberRole.js.map