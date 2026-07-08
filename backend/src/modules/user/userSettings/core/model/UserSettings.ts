import Entity from '../../../../shared/core/model/Entity';
import IdEntity from '../../../../shared/core/objects/IdEntity';
import Language from '../objects/Language';
import type UserSettingsParams from '../interfaces/UserSettingsParams';
import Theme from '../objects/Theme';
import Timezone from '../objects/Timezone';
import NotificationSettings from '../objects/NotificationSettings';
import { AllowedLanguage } from '../types/Language';
import { AllowedChannelType, AllowedNotificationType, AllowedProjectType } from '../types/NotificationSettings';
import { AllowedTheme } from '../types/Theme';

export default class UserSettings extends Entity {
  private readonly userId: IdEntity;
  private language: Language;
  private theme: Theme;
  private timezone: Timezone;
  private notificationSettings: NotificationSettings;

  public constructor(params: UserSettingsParams) {
    super(new IdEntity(params.id));
    this.userId = new IdEntity(params.userId);
    this.language = new Language(params.language ?? AllowedLanguage.en);
    this.theme = new Theme(params.theme ?? AllowedTheme.light);
    this.timezone = new Timezone(params.timezone);

    const notificationSettings = params.notificationSettings;
    this.notificationSettings = NotificationSettings.create(
      notificationSettings?.type ?? AllowedNotificationType.assigned,
      notificationSettings?.projectType ?? AllowedProjectType.all,
      notificationSettings?.channel ?? AllowedChannelType.push,
      notificationSettings?.active ?? true,
    );
  }

  public getUserId(): IdEntity {
    return this.userId;
  }

  public getLanguage(): Language {
    return this.language;
  }

  public getTheme(): Theme {
    return this.theme;
  }

  public getTimezone(): Timezone {
    return this.timezone;
  }

  public getNotificationSettings(): NotificationSettings {
    return this.notificationSettings;
  }

  public updateLanguage(language: Language): void {
    this.language = language;
  }

  public updateTheme(theme: Theme): void {
    this.theme = theme;
  }

  public updateTimezone(timezone: Timezone): void {
    this.timezone = timezone;
  }

  public updateNotificationSettings(notificationSettings: NotificationSettings): void {
    this.notificationSettings = notificationSettings;
  }

  public toPrimitives() {
    return {
      id: this.getID().toString(),
      userId: this.userId.toString(),
      language: this.language.getLanguage(),
      theme: this.theme.getTheme(),
      timezone: this.timezone.getTimezone(),
      notificationSettings: this.notificationSettings.toPrimitives(),
    };
  }
}
