import CoreError from './CoreError';

export default class InvalidOperation extends CoreError {
  constructor(message: string, data?: unknown) {
    super(message, data);
    Object.setPrototypeOf(this, InvalidOperation.prototype);
  }
}
