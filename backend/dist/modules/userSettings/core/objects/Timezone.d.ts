import ValueObject from '../../../shared/core/objects/ValueObject';
export default class Timezone extends ValueObject {
    private tz;
    private readonly testTimeZone;
    constructor(tz: string);
    getTimezone(): string;
}
//# sourceMappingURL=Timezone.d.ts.map