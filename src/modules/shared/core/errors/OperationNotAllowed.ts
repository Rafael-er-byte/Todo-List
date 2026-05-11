import CoreError from './CoreError';

export default class OperationNotAllowed extends CoreError {
  constructor(message: string, info?: unknown) {
    super(message, info);
    Object.setPrototypeOf(this, .prototype);
  }
}
