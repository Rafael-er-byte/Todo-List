import ValueObject from '../../../shared/core/objects/ValueObject';
import { AllowedNotificationType, AllowedProjectType, AllowedChannelType } from '../types/NotificationSettings';
export default class NotificationSettings extends ValueObject {
    private readonly type;
    private readonly projectType;
    private readonly channel;
    private readonly active;
    constructor(type: AllowedNotificationType, projectType: AllowedProjectType, channel: AllowedChannelType, active: boolean);
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