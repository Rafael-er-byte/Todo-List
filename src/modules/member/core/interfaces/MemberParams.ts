import type { Image } from '../../../shared/core/types/ImageTypes';
import type { AllowedMemberRoles } from '../types/AllowedMemberRoles';
import type { AllowedMemberStatus } from '../types/AllowedMemberStatus';

export default interface MemberParams {
  id: string;
  idProject: string;
  status: AllowedMemberStatus;
  role: AllowedMemberRoles;
  urlProfileImage: Image | null;
}
