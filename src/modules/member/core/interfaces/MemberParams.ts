import type { AllowedMemberRoles } from '../types/AllowedMemberRoles';
import type { AllowedMemberStatus } from '../types/AllowedMemberStatus';

export default interface MemberParams {
  id: string;
  idProject: string;
  idAccount: string;
  status: AllowedMemberStatus;
  role: AllowedMemberRoles;
  idInternal: number | null;
  version: number | null;
  deletedAt: Date | null;
}
