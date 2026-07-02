import ValueObject from '../../../../shared/core/objects/ValueObject';
import InvalidTimezone from '../errors/InvalidTimezone';
export default class Timezone extends ValueObject {
    constructor(tz) {
        super();
        this.testTimeZone = /^[A-Za-z]+\/[A-Za-z_]+(?:\/[A-Za-z_]+)*$/;
        if (!tz || !this.testTimeZone.test(tz))
            throw new InvalidTimezone(tz);
        this.tz = tz;
    }
    getTimezone() {
        return this.tz;
    }
}
//# sourceMappingURL=Timezone.js.map