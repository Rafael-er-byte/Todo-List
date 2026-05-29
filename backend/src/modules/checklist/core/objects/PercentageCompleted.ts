import InvalidParameters from '../../../shared/core/errors/InvalidParameters';
import Decimal from '../../../shared/core/objects/Decimal';
import ValueObject from '../../../shared/core/objects/ValueObject';

export default class PercentageCompleted extends ValueObject {
  private value!: Decimal;

  constructor(value: number) {
    super();
    this.value = new Decimal(value);
    if (this.value.getValue() < 0 || this.value.getValue() > 100) {
      throw new InvalidParameters('Value must be in 0 to 100 range', { value });
    }
  }

  public getValue(): number {
    return this.value.getValue();
  }

  public toPrimitive(): number {
    return this.value.toPrimitive();
  }
}
