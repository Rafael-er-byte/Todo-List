import InvalidParameters from "../errors/InvalidParameters";
import IntNumber from "./IntNumber";
export default class Version {
    constructor(version) {
        this.version = new IntNumber(version);
        if (this.version.getValue() < 0) {
            throw new InvalidParameters('Version number cannot be negative');
        }
    }
    increment() {
        return new Version(this.version.getValue() + 1);
    }
    valueOf() {
        return this.version.getValue();
    }
}
//# sourceMappingURL=Version.js.map