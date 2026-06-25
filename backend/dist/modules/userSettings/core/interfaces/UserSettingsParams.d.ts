import type { AllowedChannelType, AllowedNotificationType, AllowedProjectType } from '../types/NotificationSettings';
import type { AllowedTheme } from '../types/Theme';
import type { AllowedLanguage } from '../types/Language';
export default interface UserSettingsParams {
    id: string;
    userId: string;
    language: AllowedLanguage;
    theme: AllowedTheme;
    timezone: string;
    notificationSettings: {
        type: AllowedNotificationType;
        projectType: AllowedProjectType;
        channel: AllowedChannelType;
        active: boolean;
    };
}
//# sourceMappingURL=UserSettingsParams.d.ts.map