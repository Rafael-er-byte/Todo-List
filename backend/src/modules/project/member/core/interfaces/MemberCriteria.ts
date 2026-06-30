import type IdEntity from '../../../../shared/core/objects/IdEntity';
import type { AllowedMemberRoles } from '../../../../shared/core/types/AllowedMemberRoles';
import type { AllowedMemberStatus } from '../types/AllowedMemberStatus';

export default interface MemberCriteria {
  limit: number;
  page: number;
  nameLike: string;
  status: AllowedMemberStatus | 'All';
  role: AllowedMemberRoles | 'All';
  idProject: IdEntity;
}
