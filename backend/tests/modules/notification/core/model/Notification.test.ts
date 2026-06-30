import { describe, expect, it } from 'vitest';
import NotificationAlreadyRead from '../../../../../src/modules/notification/core/error/NotificationAlreadyRead';
import Notification from '../../../../../src/modules/notification/core/model/Notification';
import { AllowedNotificationStatus } from '../../../../../src/modules/notification/core/types/AllowedNotificationStatus';
import { NotificationTypes } from '../../../../../src/modules/notification/core/types/NotificationTypes';
import type DomainEvent from '../../../../../src/modules/shared/core/events/DomainEvent';
import IdEntity from '../../../../../src/modules/shared/core/objects/IdEntity';

const DEFAULT_ID = '019df05a-8588-758c-b5e7-92af14bf85cf';
const EVENT_ID = '019df05a-8588-758c-b5e7-92af14bf85c0';
const USER_ID = '019df05a-8588-758c-b5e7-92af14bf85c1';
const ACTOR_ID = '019df05a-8588-758c-b5e7-92af14bf85c2';

const createNotificationParams = (
  overrides?: Partial<{
    id: string;
    eventKey: string;
    status: AllowedNotificationStatus;
    idUser: string;
    type: NotificationTypes;
    key: string;
  }>,
) => ({
  id: DEFAULT_ID,
  eventKey: EVENT_ID,
  status: AllowedNotificationStatus.unread,
  idUser: USER_ID,
  type: NotificationTypes.info,
  key: 'test-key',
  ...overrides,
});

const buildNotification = (overrides?: Parameters<typeof createNotificationParams>[0]) => {
  const params = createNotificationParams(overrides);

  return Notification.create(
    {
      key: params.key,
      id: params.id,
      eventKey: params.eventKey,
      idUser: params.idUser,
      actor: ACTOR_ID,
      type: params.type,
    },
  );
};

describe('Notification Entity', () => {
  describe('Creation', () => {
    it('should create a valid unread notification', () => {
      const notification = buildNotification();

      expect(notification.getId().getID()).toBe(DEFAULT_ID);
      expect(notification.getEventKey()).toBe(EVENT_ID);
      expect(notification.getIdUser().getID()).toBe(USER_ID);
      expect(notification.getStatus().getStatus()).toBe(AllowedNotificationStatus.unread);
      expect(notification.getType()).toBe(NotificationTypes.info);
    });

    it('should emit NotificationCreated event on creation', () => {
      const notification = buildNotification();

      const events = notification.pullEvents();

      expect(events).toHaveLength(1);
      expect((events[0] as DomainEvent).getEvent()).toBe('NOTIFICATION_CREATED');
    });
  });

  describe('Read Status', () => {
    it('should mark an unread notification as read', () => {
      const notification = buildNotification();
      notification.pullEvents();

      notification.markAsRead('read-key', new IdEntity(ACTOR_ID));

      expect(notification.getStatus().getStatus()).toBe(AllowedNotificationStatus.read);
    });

    it('should emit NotificationRead event when marked as read', () => {
      const notification = buildNotification();
      notification.pullEvents();

      notification.markAsRead('read-key', new IdEntity(ACTOR_ID));

      const events = notification.pullEvents();
      expect(events).toHaveLength(1);
      expect((events[0] as DomainEvent).getEvent()).toBe('NOTIFICATION_READ');
    });

    it('should not allow marking a notification as read twice', () => {
      const notification = buildNotification();

      notification.markAsRead('read-key', new IdEntity(ACTOR_ID));

      expect(() => {
        notification.markAsRead('read-key-2', new IdEntity(ACTOR_ID));
      }).toThrow(NotificationAlreadyRead);
    });

    it('should not emit a second event when marking as read twice fails', () => {
      const notification = buildNotification();
      notification.pullEvents();

      notification.markAsRead('read-key', new IdEntity(ACTOR_ID));
      notification.pullEvents();

      try {
        notification.markAsRead('read-key-2', new IdEntity(ACTOR_ID));
      } catch (e) {
        expect(e).toBeInstanceOf(NotificationAlreadyRead);
      }

      expect(notification.pullEvents()).toHaveLength(0);
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

      expect(notification.getId().getID()).toBe(params.id);
      expect(notification.getEventKey()).toBe(params.eventKey);
      expect(notification.getIdUser().getID()).toBe(params.idUser);
      expect(notification.getStatus().getStatus()).toBe(AllowedNotificationStatus.read);
      expect(notification.getType()).toBe(params.type);
    });

    it('should preserve immutable details after marking as read', () => {
      const notification = buildNotification();

      notification.markAsRead('read-key', new IdEntity(ACTOR_ID));

      const primitives = notification.toPrimitives();
      expect(primitives.id).toBe(DEFAULT_ID);
      expect(primitives.eventKey).toBe(EVENT_ID);
      expect(primitives.idUser).toBe(USER_ID);
      expect(primitives.type).toBe(NotificationTypes.info);
      expect(primitives.status).toBe(AllowedNotificationStatus.read);
    });
  });
});
