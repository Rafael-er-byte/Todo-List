import ValueObject from '../../../../shared/core/objects/ValueObject';
import MemberStatusNotSupported from '../error/MemberStatusNotSupported';
import { ALLOWED_MEMBER_STATUS, AllowedMemberStatus } from '../types/AllowedMemberStatus';

export default class MemberStatus extends ValueObject {
  private status!: AllowedMemberStatus;

  private constructor(status: AllowedMemberStatus) {
    super();
    if (!ALLOWED_MEMBER_STATUS.includes(status)) throw new MemberStatusNotSupported(status);
    this.status = status;
  }

  public static create(status: AllowedMemberStatus): MemberStatus {
    return new MemberStatus(status);
  }

  public static blocked(): MemberStatus {
    return new MemberStatus(AllowedMemberStatus.blocked);
  }

  public static active(): MemberStatus {
    return new MemberStatus(AllowedMemberStatus.active);
  }

  public getStatus(): AllowedMemberStatus {
    return this.status;
  }

  public isBlocked(): boolean {
    return this.status === ALLOWED_MEMBER_STATUS[0];
  }

}
