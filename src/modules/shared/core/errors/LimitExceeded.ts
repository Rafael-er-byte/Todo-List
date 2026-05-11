import CoreError from './CoreError';

export default class LimitExceeded extends CoreError {
  constructor(message: string, info?: unknown) {
    super(message, info);
    Object.setPrototypeOf(this, LimitExceeded.prototype);
  }
}
