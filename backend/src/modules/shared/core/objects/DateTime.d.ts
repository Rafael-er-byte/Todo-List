import ValueObject from './ValueObject';
export default class DateTime extends ValueObject {
    private date;
    private constructor();
    static now(): DateTime;
    static create(date: Date): DateTime;
    static isAfter(futureDate: DateTime, now: DateTime): boolean;
    static isBefore(previosDate: DateTime, furuteDate: DateTime): boolean;
    getDate(): Date;
    getValue(): number;
}
//# sourceMappingURL=DateTime.d.ts.map