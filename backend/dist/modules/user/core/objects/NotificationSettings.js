import InvalidParameters from '../../../shared/core/errors/InvalidParameters';
import ValueObject from '../../../shared/core/objects/ValueObject';
import { ALLOWED_NOTIFICATION_TYPES, AllowedNotificationType, ALLOWED_PROJECT_TYPES, AllowedProjectType, ALLOWED_CHANNEL_TYPES, AllowedChannelType, } from '../types/NotificationSettings';
export default class NotificationSettings extends ValueObject {
    constructor(type, projectType, channel, active) {
        super();
        if (!ALLOWED_NOTIFICATION_TYPES.includes(type))
            throw new InvalidParameters('Invalid notification type');
        if (!ALLOWED_PROJECT_TYPES.includes(projectType))
            throw new InvalidParameters('Invalid project notification type');
        if (!ALLOWED_CHANNEL_TYPES.includes(channel))
            throw new InvalidParameters('Invalid channel');
        this.type = type;
        this.projectType = projectType;
        this.channel = channel;
        this.active = !!active;
    }
    static create(type, projectType, channel, active) {
        return new NotificationSettings(type, projectType, channel, active);
    }
    isActive() {
        return this.active;
    }
    toPrimitives() {
        return {
            type: this.type,
            projectType: this.projectType,
            channel: this.channel,
            active: this.active,
        };
    }
}
//# sourceMappingURL=NotificationSettings.js.map