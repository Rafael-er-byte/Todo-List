import InvalidParameters from '../errors/InvalidParameters';
import ValueObject from './ValueObject';

export default class Decimal extends ValueObject {
  private value!: number;

  constructor(value: number) {
    super();

    if (typeof value !== 'number' || Number.isNaN(value) || !Number.isFinite(value)) {
      throw new InvalidParameters('Invalid decimal value');
    }

    this.value = Number(value.toFixed(2));
  }

  public static create(value: number): Decimal {
    return new Decimal(value);
  }

  public getValue(): number {
    return this.value;
  }

  public toPrimitive(): number {
    return this.value;
  }

  public add(value: Decimal): Decimal {
    return new Decimal(this.value + value.getValue());
  }

  public subtract(value: Decimal): Decimal {
    return new Decimal(this.value - value.getValue());
  }

  public equals(value: Decimal): boolean {
    return this.value === value.getValue();
  }
}
