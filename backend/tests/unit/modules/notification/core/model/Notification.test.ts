import { describe, expect, it } from 'vitest';
import { AllowedNotificationStatus } from '../../../../../../src/modules/notification/notification/core/types/AllowedNotificationStatus';
import Notification from '../../../../../../src/modules/notification/notification/core/model/Notification'
import { NotificationTypes } from '../../../../../../src/modules/notification/notification/core/types/NotificationTypes';
import NotificationAlreadyRead from '../../../../../../src/modules/notification/notification/core/error/NotificationAlreadyRead';

const DEFAULT_ID = '019df05a-8588-758c-b5e7-92af14bf85cf';
const EVENT_ID = '019df05a-8588-758c-b5e7-92af14bf85c0';
const USER_ID = '019df05a-8588-758c-b5e7-92af14bf85c1';

const createNotificationParams = (
  overrides?: Partial<{
    id: string;
    eventKey: string;
    status: AllowedNotificationStatus;
    idUser: string;
    type: NotificationTypes;
  
  }>,
) => ({
  id: DEFAULT_ID,
  eventKey: EVENT_ID,
  status: AllowedNotificationStatus.unread,
  idUser: USER_ID,
  type: NotificationTypes.info,
  ...overrides,
});

const buildNotification = (overrides?: Parameters<typeof createNotificationParams>[0]) => {
  const params = createNotificationParams(overrides);

  return Notification.create(
    {
      id: params.id,
      eventKey: params.eventKey,
      idUser: params.idUser,
      type: params.type,
    },
  );
};

describe('Notification Entity', () => {
  describe('Creation', () => {
    it('should create a valid unread notification', () => {
      const notification = buildNotification();

      expect(notification.getId().toString()).toBe(DEFAULT_ID);
      expect(notification.getEventKey()).toBe(EVENT_ID);
      expect(notification.getIdUser().toString()).toBe(USER_ID);
      expect(notification.getStatus().getStatus()).toBe(AllowedNotificationStatus.unread);
      expect(notification.getType()).toBe(NotificationTypes.info);
    });

  });

  describe('Read Status', () => {
    it('should mark an unread notification as read', () => {
      const notification = buildNotification();

      notification.markAsRead();

      expect(notification.getStatus().getStatus()).toBe(AllowedNotificationStatus.read);
    });

    it('should not allow marking a notification as read twice', () => {
      const notification = buildNotification();

      notification.markAsRead();

      expect(() => {
        notification.markAsRead();
      }).toThrow(NotificationAlreadyRead);
    });

    it('should not emit a second event when marking as read twice fails', () => {
      const notification = buildNotification();

      notification.markAsRead();

      try {
        notification.markAsRead();
      } catch (e) {
        expect(e).toBeInstanceOf(NotificationAlreadyRead);
      }
    });
  });

  describe('Serialization', () => {
    it('should serialize notification to primitives correctly', () => {
      const params = createNotificationParams();
      const notification = buildNotification();

      const primitives = notification.toPrimitives();

      expect(primitives).toEqual({
        id: params.id,
        eventKey: params.eventKey,
        status: params.status,
        idUser: params.idUser,
        type: params.type,
      });
    });

    it('should deserialize from primitives correctly', () => {
      const params = createNotificationParams({ status: AllowedNotificationStatus.read });

      const notification = Notification.fromPrimitives(params);

      expect(notification.getId().toString()).toBe(params.id);
      expect(notification.getEventKey()).toBe(params.eventKey);
      expect(notification.getIdUser().toString()).toBe(params.idUser);
      expect(notification.getStatus().getStatus()).toBe(AllowedNotificationStatus.read);
      expect(notification.getType()).toBe(params.type);
    });

    it('should preserve immutable details after marking as read', () => {
      const notification = buildNotification();

      notification.markAsRead();

      const primitives = notification.toPrimitives();
      expect(primitives.id).toBe(DEFAULT_ID);
      expect(primitives.eventKey).toBe(EVENT_ID);
      expect(primitives.idUser).toBe(USER_ID);
      expect(primitives.type).toBe(NotificationTypes.info);
      expect(primitives.status).toBe(AllowedNotificationStatus.read);
    });
  });
});
