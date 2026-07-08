import type Notification from '../model/Notification';
import type IdNotification from '../objects/IdNotification';

export default interface NotificationRepository {
  create(notification: Notification): Promise<void>;
  update(notification: Notification): Promise<void>;
  getById(idNotification: IdNotification): Promise<Notification>;
  getManyByIds(notifications: IdNotification[], limit: number, page: number): Promise<Notification[]>;
}
