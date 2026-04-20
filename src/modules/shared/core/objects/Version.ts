import InvalidParameters from "../errors/InvalidParameters";
import IntNumber from "./IntNumber";

export default class Version {
    private version: IntNumber;

    constructor(version: number) {
        this.version = new IntNumber(version);
        if(this.version.getValue() < 0) {
            throw new InvalidParameters('Version number cannot be negative');
        }
    }

    increment(): Version {
        return new Version(this.version.getValue() + 1);
    }

    valueOf(): number {
        return this.version.getValue();
    }
}
