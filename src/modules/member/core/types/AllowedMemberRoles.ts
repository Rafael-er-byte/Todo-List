export const ALLOWED_MEMBER_ROLES = [
  'ADMIN',
  'MEMBER',
  'AUDITOR',
] as const;

export enum AllowedMemberRoles {
  admin = 'ADMIN',
  member = 'MEMBER',
  auditor = 'AUDITOR',
}
