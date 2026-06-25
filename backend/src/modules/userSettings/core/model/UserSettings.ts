import Entity from '../../../shared/core/model/Entity';
import IdEntity from '../../../shared/core/objects/IdEntity';
import Language from '../objects/Language';
import type UserSettingsParams from '../interfaces/UserSettingsParams';
import Theme from '../objects/Theme';
import Timezone from '../objects/Timezone';
import NotificationSettings from '../objects/NotificationSettings';

export default class UserSettings extends Entity {
  private readonly userId: IdEntity;
  private language: Language;
  private theme: Theme;
  private timezone: Timezone;
  private notificationSettings: NotificationSettings;

  private constructor(
    id: IdEntity,
    userId: IdEntity,
    language: Language,
    theme: Theme,
    timezone: Timezone,
    notificationSettings: NotificationSettings,
  ) {
    super(id);
    this.userId = userId;
    this.language = language;
    this.theme = theme;
    this.timezone = timezone;
    this.notificationSettings = notificationSettings;
  }

  public static create(params: UserSettingsParams): UserSettings {
    return new UserSettings(
      new IdEntity(params.id),
      new IdEntity(params.userId),
      new Language(params.language),
      new Theme(params.theme),
      new Timezone(params.timezone),
      NotificationSettings.create(
        params.notificationSettings!.type,
        params.notificationSettings!.projectType,
        params.notificationSettings!.channel,
        params.notificationSettings!.active,
      ),
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
      id: this.getID().getID(),
      userId: this.userId.getID(),
      language: this.language.getLanguage(),
      theme: this.theme.getTheme(),
      timezone: this.timezone.getTimezone(),
      notificationSettings: this.notificationSettings.toPrimitives(),
    };
  }
}
