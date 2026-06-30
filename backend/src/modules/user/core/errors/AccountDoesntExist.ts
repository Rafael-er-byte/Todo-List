import CoreError from '../../../shared/core/errors/CoreError';

export default class AccountDoesntExist extends CoreError {
  constructor(info?: unknown) {
    super('Account does not exist', info);
    Object.setPrototypeOf(this, AccountDoesntExist.prototype);
  }
}
