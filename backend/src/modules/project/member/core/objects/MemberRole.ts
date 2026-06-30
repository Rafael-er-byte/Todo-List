import ValueObject from '../../../../shared/core/objects/ValueObject';
import { ALLOWED_MEMBER_ROLES, type AllowedMemberRoles } from '../../../../shared/core/types/AllowedMemberRoles';
import MemberRoleNotValid from '../error/MemberRoleNotValid';

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
