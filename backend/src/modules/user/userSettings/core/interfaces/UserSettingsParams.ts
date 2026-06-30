import type { AllowedLanguage } from '../types/Language';
import type { AllowedChannelType, AllowedNotificationType, AllowedProjectType } from '../types/NotificationSettings';
import type { AllowedTheme } from '../types/Theme';

export default interface UserSettingsParams {
  id: string;
  userId: string;
  language: AllowedLanguage;
  theme: AllowedTheme;
  timezone: string;
  notificationSettings?: {
    type: AllowedNotificationType;
    projectType: AllowedProjectType;
    channel: AllowedChannelType;
    active: boolean;
  };
}
