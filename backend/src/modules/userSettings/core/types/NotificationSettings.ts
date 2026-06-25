export const ALLOWED_NOTIFICATION_TYPES = ['ALL', 'ASSIGNED', 'MENTIONS'] as const;
export enum AllowedNotificationType {
  all = 'ALL',
  assigned = 'ASSIGNED',
  mentions = 'MENTIONS',
}

export const ALLOWED_PROJECT_TYPES = ['WATCHING', 'FAVORITE', 'ALL'] as const;
export enum AllowedProjectType {
  watching = 'WATCHING',
  favorite = 'FAVORITE',
  all = 'ALL',
}

export const ALLOWED_CHANNEL_TYPES = ['EMAIL', 'PUSH', 'ALL'] as const;
export enum AllowedChannelType {
  email = 'EMAIL',
  push = 'PUSH',
  all = 'ALL',
}
