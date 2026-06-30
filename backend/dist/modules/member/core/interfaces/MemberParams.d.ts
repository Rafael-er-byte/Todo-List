import type { AllowedMemberRoles } from '../../../shared/core/types/AllowedMemberRoles';
import type { AllowedMemberStatus } from '../types/AllowedMemberStatus';
export default interface MemberParams {
    id: string;
    idProject: string;
    idAccount: string;
    status: AllowedMemberStatus;
    role: AllowedMemberRoles;
    projectMetadata: {
        isFavorite: boolean;
        watch: boolean;
    };
}
//# sourceMappingURL=MemberParams.d.ts.map