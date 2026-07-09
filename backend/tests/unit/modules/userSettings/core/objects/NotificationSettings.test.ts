import { describe, expect, it } from 'vitest';
import InvalidParameters from '../../../../../../src/modules/shared/core/errors/InvalidParameters';
import NotificationSettings from '../../../../../../src/modules/user/userSettings/core/objects/NotificationSettings';
import { AllowedChannelType, AllowedNotificationType, AllowedProjectType, type AllowedChannelType as AllowedChannelTypeType, type AllowedNotificationType as AllowedNotificationTypeType, type AllowedProjectType as AllowedProjectTypeType } from '../../../../../../src/modules/user/userSettings/core/types/NotificationSettings';

describe('NotificationSettings value object', () => {
  it('creates and serializes valid notification settings', () => {
    const notification = NotificationSettings.create(
      AllowedNotificationType.assigned,
      AllowedProjectType.watching,
      AllowedChannelType.push,
      true,
    );

    expect(notification.isActive()).toBe(true);
    expect(notification.toPrimitives()).toEqual({
      type: AllowedNotificationType.assigned,
      projectType: AllowedProjectType.watching,
      channel: AllowedChannelType.push,
      active: true,
    });
  });

  it('throws for invalid notification type', () => {
    expect(() =>
      NotificationSettings.create(
        'INVALID' as AllowedNotificationTypeType,
        AllowedProjectType.watching,
        AllowedChannelType.push,
        true,
      ),
    ).toThrow(InvalidParameters);
    expect(() =>
      NotificationSettings.create(
        'INVALID' as AllowedNotificationTypeType,
        AllowedProjectType.watching,
        AllowedChannelType.push,
        true,
      ),
    ).toThrow('Invalid notification type');
  });

  it('throws for invalid project type', () => {
    expect(() =>
      NotificationSettings.create(
        AllowedNotificationType.assigned,
        'INVALID' as AllowedProjectTypeType,
        AllowedChannelType.push,
        true,
      ),
    ).toThrow('Invalid project notification type');
  });

  it('throws for invalid channel type', () => {
    expect(() =>
      NotificationSettings.create(
        AllowedNotificationType.assigned,
        AllowedProjectType.watching,
        'SMS' as AllowedChannelTypeType,
        true,
      ),
    ).toThrow('Invalid channel');
  });
});
