import IntNumber from "./IntNumber";

export default class Version {
    private version: IntNumber;

    constructor(version: number) {
        this.version = new IntNumber(version);
    }

    increment(): Version {
        return new Version(this.version.getValue() + 1);
    }

    valueOf(): number {
        return this.version.getValue();
    }
}
