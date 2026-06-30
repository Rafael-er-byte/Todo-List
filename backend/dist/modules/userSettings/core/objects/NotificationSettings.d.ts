import ValueObject from '../../../shared/core/objects/ValueObject';
import { type AllowedChannelType, type AllowedNotificationType, type AllowedProjectType } from '../types/NotificationSettings';
export default class NotificationSettings extends ValueObject {
    private readonly type;
    private readonly projectType;
    private readonly channel;
    private readonly active;
    private constructor();
    static create(type: AllowedNotificationType, projectType: AllowedProjectType, channel: AllowedChannelType, active: boolean): NotificationSettings;
    isActive(): boolean;
    toPrimitives(): {
        type: AllowedNotificationType;
        projectType: AllowedProjectType;
        channel: AllowedChannelType;
        active: boolean;
    };
}
//# sourceMappingURL=NotificationSettings.d.ts.map