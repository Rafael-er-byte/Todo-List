import CoreError from '../../../shared/core/errors/CoreError';

export default class InvalidStartDate extends CoreError {
  constructor(info?: unknown) {
    super('The start date is not valid', info);
    Object.setPrototypeOf(this, InvalidStartDate.prototype);
  }
}
