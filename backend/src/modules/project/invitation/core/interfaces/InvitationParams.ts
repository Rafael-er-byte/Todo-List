import type { AllowedInvitationStatus } from '../objects/InvitationStatus';

export default interface InvitationParams {
  id: string;
  host: string;
  projectId: string;
  status: AllowedInvitationStatus;
  guest: string;
}
