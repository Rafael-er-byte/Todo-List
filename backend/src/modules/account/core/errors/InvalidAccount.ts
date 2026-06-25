import CoreError from '../../../shared/core/errors/CoreError';

export default class InvalidAccount extends CoreError {
  constructor(info?: unknown) {
    super(typeof info === 'string' ? info : 'Invalid account', info);
    Object.setPrototypeOf(this, InvalidAccount.prototype);
  }
}
