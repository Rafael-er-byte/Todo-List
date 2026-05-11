import InvalidParameters from '../errors/InvalidParameters';
import ValueObject from './ValueObject';

export default class DateTime extends ValueObject {
  private date!: Date;

  private constructor(date: Date) {
    super();
    this.date = date;
  }

  public static now(): DateTime {
    return new DateTime(new Date());
  }

  public static create(date: Date): DateTime {
    if(isNaN(date.getTime())) throw new InvalidParameters('Invalid date');
    return new DateTime(date);
  }

  static isAfter(futureDate: DateTime, now: DateTime): boolean {
    return futureDate.getValue() > now.getValue();
  }

  static isBefore(previosDate: DateTime, furuteDate: DateTime): boolean{
    return previosDate.getValue() < furuteDate.getValue();
  }

  public getDate(): Date {
    return this.date;
  }

  public getValue(): number {
    return this.date.getTime();
  }
}
