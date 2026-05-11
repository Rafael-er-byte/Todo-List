import type { AllowedMemberRoles } from '../types/AllowedMemberRoles';
import type { AllowedMemberStatus } from '../types/AllowedMemberStatus';

export default interface MemberCriteria {
  limit: number;
  page: number;
  nameLike: string;
  status: AllowedMemberStatus | 'All';
  role: AllowedMemberRoles | 'All';
}
