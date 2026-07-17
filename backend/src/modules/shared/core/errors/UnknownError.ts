import CoreError from './CoreError';

export default class UnknownError extends CoreError {
  constructor(message: string, data?: unknown) {
    super(message, data);
    Object.setPrototypeOf(this, UnknownError.prototype);
  }
}
