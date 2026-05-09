import CoreError from './CoreError';

export default class RelationshipAlreadyExists extends CoreError {
  constructor(message: string, info?: unknown) {
    super(message, info);
    Object.setPrototypeOf(this, RelationshipAlreadyExists.prototype);
  }
}
