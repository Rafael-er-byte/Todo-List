import CoreError from '../../../shared/core/errors/CoreError';

export default class MemberRoleNotValid extends CoreError {
  constructor(info?: unknown) {
    super('Member role is not valid', info);
    Object.setPrototypeOf(this, MemberRoleNotValid.prototype);
  }
}
