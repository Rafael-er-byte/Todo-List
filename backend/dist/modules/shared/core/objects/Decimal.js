import InvalidParameters from '../errors/InvalidParameters';
import ValueObject from './ValueObject';
export default class Decimal extends ValueObject {
    constructor(value) {
        super();
        if (typeof value !== 'number' || Number.isNaN(value) || !Number.isFinite(value)) {
            throw new InvalidParameters('Invalid decimal value');
        }
        this.value = Number(value.toFixed(2));
    }
    static create(value) {
        return new Decimal(value);
    }
    getValue() {
        return this.value;
    }
    toPrimitive() {
        return this.value;
    }
    add(value) {
        return new Decimal(this.value + value.getValue());
    }
    subtract(value) {
        return new Decimal(this.value - value.getValue());
    }
    equals(value) {
        return this.value === value.getValue();
    }
}
//# sourceMappingURL=Decimal.js.map