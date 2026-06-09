import type { AllowedNotificationStatus } from '../types/AllowedNotificationStatus';

export default interface NotificationParams {
  id: string;
  eventKey: string;
  status: AllowedNotificationStatus;
  idUser: string;
  version: number;
  deletedAt: Date | null;
}
