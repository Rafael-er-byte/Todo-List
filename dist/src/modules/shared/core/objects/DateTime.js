import InvalidParameters from '../errors/InvalidParameters';
import ValueObject from './ValueObject';
export default class DateTime extends ValueObject {
    constructor(date) {
        super();
        this.date = date;
    }
    static now() {
        return new DateTime(new Date());
    }
    static create(date) {
        if (isNaN(date.getTime()))
            throw new InvalidParameters('Invalid date');
        return new DateTime(date);
    }
    static isAfter(futureDate, now) {
        return futureDate.getValue() > now.getValue();
    }
    static isBefore(previosDate, furuteDate) {
        return previosDate.getValue() < furuteDate.getValue();
    }
    getDate() {
        return this.date;
    }
    getValue() {
        return this.date.getTime();
    }
}
//# sourceMappingURL=DateTime.js.map