import NotificationSettings from '../../../../../src/modules/userSettings/core/objects/NotificationSettings';
import { describe, it, expect } from 'vitest';
import { AllowedNotificationType, AllowedProjectType, AllowedChannelType } from '../../../../../src/modules/userSettings/core/types/NotificationSettings';

describe('NotificationSettings value object', () => {
  it('creates with valid values', () => {
    const s = NotificationSettings.create(
      AllowedNotificationType.all,
      AllowedProjectType.all,
      AllowedChannelType.email,
      true,
    );
    expect(s).toBeInstanceOf(NotificationSettings);
    expect(s.isActive()).toBe(true);
  });

  it('throws for invalid types', () => {
    expect(() => NotificationSettings.create('BAD' as any, AllowedProjectType.all, AllowedChannelType.email, true)).toThrow();
    expect(() => NotificationSettings.create(AllowedNotificationType.all, 'BAD' as any, AllowedChannelType.email, true)).toThrow();
    expect(() => NotificationSettings.create(AllowedNotificationType.all, AllowedProjectType.all, 'BAD' as any, true)).toThrow();
  });
});
