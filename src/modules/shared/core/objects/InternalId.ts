import InvalidParameters from "../errors/InvalidParameters";
import IntNumber from "./IntNumber";

export default class InternalId {
    private id!: IntNumber;

    constructor(id: number) {
        this.id = new IntNumber(id);
        if(this.id.getValue() <= 0) throw new InvalidParameters('Invalid InternalId. Expected a positive integer.', { id: this.id.getValue() });
    }

    public getId(): number {
        return this.id.getValue();
    }
}
