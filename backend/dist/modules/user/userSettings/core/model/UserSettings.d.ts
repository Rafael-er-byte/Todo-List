import Entity from '../../../../shared/core/model/Entity';
import IdEntity from '../../../../shared/core/objects/IdEntity';
import Language from '../objects/Language';
import type UserSettingsParams from '../interfaces/UserSettingsParams';
import Theme from '../objects/Theme';
import Timezone from '../objects/Timezone';
import NotificationSettings from '../objects/NotificationSettings';
export default class UserSettings extends Entity {
    private readonly userId;
    private language;
    private theme;
    private timezone;
    private notificationSettings;
    constructor(params: UserSettingsParams);
    getUserId(): IdEntity;
    getLanguage(): Language;
    getTheme(): Theme;
    getTimezone(): Timezone;
    getNotificationSettings(): NotificationSettings;
    updateLanguage(language: Language): void;
    updateTheme(theme: Theme): void;
    updateTimezone(timezone: Timezone): void;
    updateNotificationSettings(notificationSettings: NotificationSettings): void;
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