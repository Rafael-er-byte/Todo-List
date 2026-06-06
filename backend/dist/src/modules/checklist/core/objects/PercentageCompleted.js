import InvalidParameters from '../../../shared/core/errors/InvalidParameters';
import Decimal from '../../../shared/core/objects/Decimal';
import ValueObject from '../../../shared/core/objects/ValueObject';
export default class PercentageCompleted extends ValueObject {
    constructor(value) {
        super();
        this.value = new Decimal(value);
        if (this.value.getValue() < 0 || this.value.getValue() > 100) {
            throw new InvalidParameters('Value must be in 0 to 100 range', { value });
        }
    }
    getValue() {
        return this.value.getValue();
    }
    toPrimitive() {
        return this.value.toPrimitive();
    }
}
//# sourceMappingURL=PercentageCompleted.js.map