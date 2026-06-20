import ValueObject from '../../../shared/core/objects/ValueObject';
import InvalidFormat from '../errors/InvalidFormat';

export default class Email extends ValueObject {
  private readonly value!: string;

  constructor(email: string) {
    super();
    if (!Email.isValidEmail(email)) {
      throw new InvalidFormat('Invalid email format');
    }
    this.value = email.toLowerCase();
  }

  public static isValidEmail(email: string): boolean {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return typeof email === 'string' && re.test(email);
  }

  public toString(): string {
    return this.value;
  }

  public getEmail(): string {
    return this.value;
  }
}
