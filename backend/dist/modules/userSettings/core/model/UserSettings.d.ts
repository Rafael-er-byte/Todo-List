import Entity from '../../../shared/core/model/Entity';
import IdEntity from '../../../shared/core/objects/IdEntity';
import Language from '../objects/Language';
import Theme from '../objects/Theme';
import Timezone from '../objects/Timezone';
import NotificationSettings from '../objects/NotificationSettings';
import type UserSettingsParams from '../interfaces/UserSettingsParams';
export type UserSettingsKey = 'language' | 'theme' | 'timezone' | 'notificationSettings';
export type UserSettingsUpdateValue<K extends UserSettingsKey> = K extends 'language' ? Language : K extends 'theme' ? Theme : K extends 'timezone' ? Timezone : K extends 'notificationSettings' ? NotificationSettings : never;
export default class UserSettings extends Entity {
    private readonly userId;
    private language;
    private theme;
    private timezone;
    private notificationSettings;
    private constructor();
    static create(params: UserSettingsParams): UserSettings;
    static fromPrimitives(params: UserSettingsParams): UserSettings;
    getUserId(): IdEntity;
    getLanguage(): Language;
    getTheme(): Theme;
    getTimezone(): Timezone;
    getNotificationSettings(): NotificationSettings;
    updateLanguage(language: Language): void;
    updateTheme(theme: Theme): void;
    updateTimezone(timezone: Timezone): void;
    updateNotificationSettings(notificationSettings: NotificationSettings): void;
    updateSetting<K extends UserSettingsKey>(key: K, value: UserSettingsUpdateValue<K>): void;
    toPrimitives(): {
        id: string;
        userId: string;
        language: import("../types/Language").AllowedLanguage;
        theme: import("../types/Theme").AllowedTheme;
        timezone: string;
        notificationSettings: {
            type: import("../types/NotificationSettings").AllowedNotificationType;
            projectType: import("../types/NotificationSettings").AllowedProjectType;
            channel: import("../types/NotificationSettings").AllowedChannelType;
            active: boolean;
        };
    };
}
//# sourceMappingURL=UserSettings.d.ts.map