import CoreError from '../../../shared/core/errors/CoreError';

export default class MemberMustBeActive extends CoreError {
  constructor(info?: unknown) {
    super('The membes must be active', info);
    Object.setPrototypeOf(this, MemberMustBeActive.prototype);
  }
}
