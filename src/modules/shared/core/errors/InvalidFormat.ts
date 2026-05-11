import CoreError from './CoreError';

export default class InvalidFormat extends CoreError {
  constructor(message: string, data?: unknown) {
    super(message, data);
    Object.setPrototypeOf(this, InvalidFormat.prototype);
  }
}
