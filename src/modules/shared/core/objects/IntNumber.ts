import InvalidParameters from '../errors/InvalidParameters';
import ValueObject from './ValueObject';

export default class IntNumber extends ValueObject {
  private value!: number;

  constructor(value: number) {
    super();
    if (!(typeof value === 'number')) throw new InvalidParameters(' Must be a number');
    const positiveDecimal = value < 0 ? value * -1 : value;
    const positiveInteger = value < 0 ? Math.trunc(value * -1) : Math.trunc(value);
    
    const isDecimal = (positiveDecimal - positiveInteger) > 0;
    if (isDecimal) throw new InvalidParameters('Number must be integer');
    this.value = value;
  }

  public getValue(): number {
    return this.value;
  }
}
