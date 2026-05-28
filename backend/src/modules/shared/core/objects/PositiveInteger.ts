import InvalidParameters from "../errors/InvalidParameters";
import IntNumber from "./IntNumber";
import ValueObject from "./ValueObject";

export default class PositiveInteger extends ValueObject{
    private value: IntNumber;
    
    constructor(value: number){
        super();
        this.value = new IntNumber(value);
        if(this.value.getValue() < 0)throw new InvalidParameters('Value must be a valid positive integer', {value: value});
    }

    public getValue(): number{
        return this.value.getValue();
    }
}
