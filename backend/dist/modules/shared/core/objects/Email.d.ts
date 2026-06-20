import ValueObject from '../../../shared/core/objects/ValueObject';
export default class Email extends ValueObject {
    private readonly value;
    constructor(email: string);
    static isValidEmail(email: string): boolean;
    toString(): string;
    getEmail(): string;
}
//# sourceMappingURL=Email.d.ts.map