import { describe, expect, it } from 'vitest';
import NotificationStatusNotSupported from '../../../../../src/modules/notification/core/error/NotificationStatusNotSupported';
import NotificationStatus from '../../../../../src/modules/notification/core/objects/NotificationStatus';
import { AllowedNotificationStatus } from '../../../../../src/modules/notification/core/types/AllowedNotificationStatus';
describe('NotificationStatus Value Object', () => {
    it('should create an unread status correctly', () => {
        const status = NotificationStatus.unread();
        expect(status.getStatus()).toBe(AllowedNotificationStatus.unread);
        expect(status.isUnread()).toBe(true);
        expect(status.isRead()).toBe(false);
    });
    it('should create a read status correctly', () => {
        const status = NotificationStatus.read();
        expect(status.getStatus()).toBe(AllowedNotificationStatus.read);
        expect(status.isRead()).toBe(true);
        expect(status.isUnread()).toBe(false);
    });
    it('should create status using factory method', () => {
        const status = NotificationStatus.create(AllowedNotificationStatus.read);
        expect(status.getStatus()).toBe(AllowedNotificationStatus.read);
    });
    it('should throw error for unsupported status', () => {
        expect(() => {
            NotificationStatus.create('INVALID');
        }).toThrow(NotificationStatusNotSupported);
    });
});
//# sourceMappingURL=NotificationStatus.test.js.map