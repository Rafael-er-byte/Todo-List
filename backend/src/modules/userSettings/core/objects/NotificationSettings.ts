import InvalidParameters from '../../../shared/core/errors/InvalidParameters';
import ValueObject from '../../../shared/core/objects/ValueObject';
import { ALLOWED_CHANNEL_TYPES, ALLOWED_NOTIFICATION_TYPES, ALLOWED_PROJECT_TYPES, type AllowedChannelType, type AllowedNotificationType, type AllowedProjectType } from '../types/NotificationSettings';

export default class NotificationSettings extends ValueObject {
  private readonly type: AllowedNotificationType;
  private readonly projectType: AllowedProjectType;
  private readonly channel: AllowedChannelType;
  private readonly active: boolean;

  private constructor(
    type: AllowedNotificationType,
    projectType: AllowedProjectType,
    channel: AllowedChannelType,
    active: boolean,
  ) {
    super();
    if (!ALLOWED_NOTIFICATION_TYPES.includes(type)) throw new InvalidParameters('Invalid notification type');
    if (!ALLOWED_PROJECT_TYPES.includes(projectType)) throw new InvalidParameters('Invalid project notification type');
    if (!ALLOWED_CHANNEL_TYPES.includes(channel)) throw new InvalidParameters('Invalid channel');
    this.type = type;
    this.projectType = projectType;
    this.channel = channel;
    this.active = !!active;
  }

  public static create(
    type: AllowedNotificationType,
    projectType: AllowedProjectType,
    channel: AllowedChannelType,
    active: boolean,
  ): NotificationSettings {
    return new NotificationSettings(type, projectType, channel, active);
  }

  public isActive(): boolean {
    return this.active;
  }

  public toPrimitives() {
    return {
      type: this.type,
      projectType: this.projectType,
      channel: this.channel,
      active: this.active,
    };
  }
}
