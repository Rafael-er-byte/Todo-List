import { describe, it, expect } from 'vitest';
import UserSettings from '../../../../../src/modules/userSettings/core/model/UserSettings';
import Language from '../../../../../src/modules/userSettings/core/objects/Language';
import Theme from '../../../../../src/modules/userSettings/core/objects/Theme';
import Timezone from '../../../../../src/modules/userSettings/core/objects/Timezone';
import NotificationSettings from '../../../../../src/modules/userSettings/core/objects/NotificationSettings';
import { AllowedChannelType, AllowedNotificationType, AllowedProjectType } from '../../../../../src/modules/userSettings/core/types/NotificationSettings';
import { AllowedLanguage } from '../../../../../src/modules/userSettings/core/types/Language';
import { AllowedTheme } from '../../../../../src/modules/userSettings/core/types/Theme';
import ID from '../../../../../src/modules/shared/core/objects/ID';
import InvalidUserSettingsKey from '../../../../../src/modules/userSettings/core/errors/InvalidUserSettingsKey';

describe('UserSettings entity', () => {
  it('creates from primitives and updates typed settings values', () => {
    const params = {
      id: ID.generateId().getId(),
      userId: ID.generateId().getId(),
      language: AllowedLanguage.en,
      theme: AllowedTheme.dark,
      timezone: 'Europe/Madrid',
      notificationSettings: {
        type: AllowedNotificationType.all,
        projectType: AllowedProjectType.all,
        channel: AllowedChannelType.email,
        active: true,
      },
    };

    const settings = UserSettings.fromPrimitives(params);

    expect(settings.getUserId().getID()).toBe(params.userId);
    expect(settings.getLanguage().getLanguage()).toBe(params.language);
    expect(settings.getTheme().getTheme()).toBe(params.theme);
    expect(settings.getTimezone().getTimezone()).toBe(params.timezone);
    expect(settings.getNotificationSettings().toPrimitives()).toEqual({
      type: params.notificationSettings.type,
      projectType: params.notificationSettings.projectType,
      channel: params.notificationSettings.channel,
      active: params.notificationSettings.active,
    });

    settings.updateLanguage(Language.create(AllowedLanguage.es));
    expect(settings.getLanguage().getLanguage()).toBe(AllowedLanguage.es);

    settings.updateSetting('theme', Theme.create(AllowedTheme.light));
    expect(settings.getTheme().getTheme()).toBe(AllowedTheme.light);

    settings.updateSetting('timezone', new Timezone('America/New_York'));
    expect(settings.getTimezone().getTimezone()).toBe('America/New_York');

    const notificationSettings = NotificationSettings.create(
      AllowedNotificationType.mentions,
      AllowedProjectType.favorite,
      AllowedChannelType.push,
      false,
    );
    settings.updateNotificationSettings(notificationSettings);
    expect(settings.getNotificationSettings().toPrimitives()).toEqual(notificationSettings.toPrimitives());
  });

  it('throws when updating with an invalid setting key', () => {
    const params = {
      id: ID.generateId().getId(),
      userId: ID.generateId().getId(),
      language: AllowedLanguage.en,
      theme: AllowedTheme.dark,
      timezone: 'Europe/Madrid',
      notificationSettings: {
        type: AllowedNotificationType.all,
        projectType: AllowedProjectType.all,
        channel: AllowedChannelType.email,
        active: true,
      },
    };

    const settings = UserSettings.fromPrimitives(params);
    expect(() => settings.updateSetting('invalid' as any, Language.create(AllowedLanguage.en) as any)).toThrow(InvalidUserSettingsKey);
  });
});
