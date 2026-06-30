import { describe, it, expect } from 'vitest';
import UserSettings from '../../../../../src/modules/user/userSettings/core/model/UserSettings';
import Language from '../../../../../src/modules/user/userSettings/core/objects/Language';
import Theme from '../../../../../src/modules/user/userSettings/core/objects/Theme';
import Timezone from '../../../../../src/modules/user/userSettings/core/objects/Timezone';
import NotificationSettings from '../../../../../src/modules/user/userSettings/core/objects/NotificationSettings';
import { AllowedChannelType, AllowedNotificationType, AllowedProjectType, type AllowedChannelType as AllowedChannelTypeType, type AllowedNotificationType as AllowedNotificationTypeType, type AllowedProjectType as AllowedProjectTypeType } from '../../../../../src/modules/user/userSettings/core/types/NotificationSettings';
import { AllowedLanguage, type AllowedLanguage as AllowedLanguageType } from '../../../../../src/modules/user/userSettings/core/types/Language';
import { AllowedTheme, type AllowedTheme as AllowedThemeType } from '../../../../../src/modules/user/userSettings/core/types/Theme';
import ID from '../../../../../src/modules/shared/core/objects/ID';
import InvalidParameters from '../../../../../src/modules/shared/core/errors/InvalidParameters';

const buildParams = () => ({
  id: ID.generateId().toString(),
  userId: ID.generateId().toString(),
  language: AllowedLanguage.en as AllowedLanguageType,
  theme: AllowedTheme.dark as AllowedThemeType,
  timezone: 'Europe/Madrid',
  notificationSettings: {
    type: AllowedNotificationType.all as AllowedNotificationTypeType,
    projectType: AllowedProjectType.all as AllowedProjectTypeType,
    channel: AllowedChannelType.email as AllowedChannelTypeType,
    active: true,
  },
});

describe('UserSettings entity', () => {
  it('creates from params and exposes values', () => {
    const params = buildParams();
    const settings = new UserSettings(params);

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
    expect(settings.toPrimitives()).toEqual(params);
  });

  it('updates language, theme, timezone and notification settings', () => {
    const params = buildParams();
    const settings = new UserSettings(params);

    settings.updateLanguage(new Language(AllowedLanguage.es));
    expect(settings.getLanguage().getLanguage()).toBe(AllowedLanguage.es);

    settings.updateTheme(new Theme(AllowedTheme.light));
    expect(settings.getTheme().getTheme()).toBe(AllowedTheme.light);

    settings.updateTimezone(new Timezone('America/New_York'));
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

  it('throws when notification settings values are invalid', () => {
    const params = {
      ...buildParams(),
      notificationSettings: {
        type: 'INVALID' as AllowedNotificationTypeType,
        projectType: AllowedProjectType.all,
        channel: AllowedChannelType.email,
        active: true,
      },
    };

    expect(() => new UserSettings(params)).toThrow(InvalidParameters);
  });
});
