import CoreError from './CoreError';

export default class ResourceNotFound extends CoreError {
  constructor(message: string, info?: unknown) {
    super(message, info);
    Object.setPrototypeOf(this, ResourceNotFound.prototype);
  }
}
