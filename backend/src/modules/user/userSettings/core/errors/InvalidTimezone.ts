import InvalidParameters from '../../../../shared/core/errors/InvalidParameters';

export default class InvalidTimezone extends InvalidParameters {
  constructor(timezone: string) {
    super(`Invalid timezone format: ${timezone}`);
    Object.setPrototypeOf(this, InvalidTimezone.prototype);
  }
}
