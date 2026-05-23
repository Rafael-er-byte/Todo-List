import ValueObject from './ValueObject';
export default class Decimal extends ValueObject {
    private value;
    constructor(value: number);
    static create(value: number): Decimal;
    getValue(): number;
    toPrimitive(): number;
    add(value: Decimal): Decimal;
    subtract(value: Decimal): Decimal;
    equals(value: Decimal): boolean;
}
//# sourceMappingURL=Decimal.d.ts.map