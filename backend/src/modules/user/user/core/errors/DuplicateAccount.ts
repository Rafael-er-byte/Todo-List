import CoreError from '../../../../shared/core/errors/CoreError';

export default class DuplicateAccount extends CoreError {
  constructor(info?: unknown) {
    super('Account already added to user', info);
    Object.setPrototypeOf(this, DuplicateAccount.prototype);
  }
}
