import ValueObject from '../../../shared/core/objects/ValueObject';
import Language from './Language';
import Theme from './Theme';
import Timezone from './Timezone';
import NotificationSettings from './NotificationSettings';
export default class UserSettings extends ValueObject {
    private readonly language;
    private readonly theme;
    private readonly timezone;
    private readonly notificationSettings;
    constructor(language: Language, theme: Theme, timezone: Timezone, notificationSettings: NotificationSettings);
    toPrimitives(): {
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
    static fromPrimitives(params: any): UserSettings;
}
//# sourceMappingURL=UserSettings.d.ts.map