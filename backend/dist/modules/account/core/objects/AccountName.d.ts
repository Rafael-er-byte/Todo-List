import ValueObject from '../../../shared/core/objects/ValueObject';
export default class AccountName extends ValueObject {
    private readonly name;
    constructor(name: string);
    getName(): string;
    toPrimitives(): string;
}
//# sourceMappingURL=AccountName.d.ts.map