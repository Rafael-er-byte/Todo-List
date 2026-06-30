import CoreError from '../../../../shared/core/errors/CoreError';

export default class MemberMustBeActive extends CoreError {
  constructor(info?: unknown) {
    super('The member must be active', info);
    Object.setPrototypeOf(this, MemberMustBeActive.prototype);
  }
}
