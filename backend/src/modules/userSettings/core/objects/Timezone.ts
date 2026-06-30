import ValueObject from '../../../shared/core/objects/ValueObject';
import InvalidTimezone from '../errors/InvalidTimezone';

export default class Timezone extends ValueObject {
  private tz!: string;
  private readonly testTimeZone = /^[A-Za-z]+\/[A-Za-z_]+(?:\/[A-Za-z_]+)*$/;

  public constructor(tz: string) {
    super();
    if (!tz || !this.testTimeZone.test(tz)) throw new InvalidTimezone(tz);
    this.tz = tz;
  }

  public getTimezone(): string {
    return this.tz;
  }
}
