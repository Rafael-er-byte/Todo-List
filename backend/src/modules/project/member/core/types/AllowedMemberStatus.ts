export const ALLOWED_MEMBER_STATUS = ['BLOCKED', 'ACTIVE', 'DELETED'] as const;

export enum AllowedMemberStatus {
  blocked = 'BLOCKED',
  active = 'ACTIVE'
}
