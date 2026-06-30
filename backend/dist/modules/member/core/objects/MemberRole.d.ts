import ValueObject from '../../../shared/core/objects/ValueObject';
import { type AllowedMemberRoles } from '../../../shared/core/types/AllowedMemberRoles';
export default class MemberRole extends ValueObject {
    private role;
    constructor(role: AllowedMemberRoles);
    getRole(): AllowedMemberRoles;
}
//# sourceMappingURL=MemberRole.d.ts.map