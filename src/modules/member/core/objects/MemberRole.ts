import ValueObject from '../../../shared/core/objects/ValueObject';
import MemberRoleNotValid from '../error/MemberRoleNotValid';
import { ALLOWED_MEMBER_ROLES, AllowedMemberRoles } from '../types/AllowedMemberRoles';

export default class MemberRole extends ValueObject {
  private role!: AllowedMemberRoles;

  constructor(role: AllowedMemberRoles) {
    super();
    if (!ALLOWED_MEMBER_ROLES.includes(role)) throw new MemberRoleNotValid(role);
    this.role = role;
  }

  public getRole(): AllowedMemberRoles {
    return this.role;
  }
  
}
