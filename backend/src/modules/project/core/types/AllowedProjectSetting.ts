export const ALLOWED_PROJECT_SETTING = ['ADMINS', 'MEMBER'] as const;

export enum AllowedProjectSetting {
  admins = 'ADMINS',
  member = 'MEMBER',
}
