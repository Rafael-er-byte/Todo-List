import ValueObject from '../../../shared/core/objects/ValueObject';
import { AllowedMemberRoles } from '../types/AllowedMemberRoles';
export default class MemberRole extends ValueObject {
    private role;
    constructor(role: AllowedMemberRoles);
    getRole(): AllowedMemberRoles;
}
//# sourceMappingURL=MemberRole.d.ts.map