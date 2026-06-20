import InvalidParameters from "../errors/InvalidParameters";
import IntNumber from "./IntNumber";
import ValueObject from "./ValueObject";
export default class PositiveInteger extends ValueObject {
    constructor(value) {
        super();
        this.value = new IntNumber(value);
        if (this.value.getValue() <= 0)
            throw new InvalidParameters('Value must be a valid positive integer', { value: value });
    }
    getValue() {
        return this.value.getValue();
    }
}
//# sourceMappingURL=PositiveInteger.js.map