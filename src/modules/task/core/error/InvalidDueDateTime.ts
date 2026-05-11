import CoreError from '../../../shared/core/errors/CoreError';

export default class InvalidDueDate extends CoreError {
  constructor(info?: unknown) {
    super('The Due date is not valid', info);
    Object.setPrototypeOf(this, InvalidDueDate.prototype);
  }
}
