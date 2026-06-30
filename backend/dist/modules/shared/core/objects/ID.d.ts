import ValueObject from './ValueObject';
export default class ID extends ValueObject {
    private id;
    private constructor();
    private validateId;
    static generateId(): ID;
    static fromString(id: string): ID;
    toString(): string;
}
//# sourceMappingURL=ID.d.ts.map