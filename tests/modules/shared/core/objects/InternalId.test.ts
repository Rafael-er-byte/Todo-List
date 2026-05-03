import InvalidParameters from "../../../../../src/modules/shared/core/errors/InvalidParameters";
import InternalId from "../../../../../src/modules/shared/core/objects/InternalId";

describe('InternalId', () => {
    it('should create an internal id when given a positive integer', () => {
        const internalId = new InternalId(5);
        expect(internalId.getId()).toBe(5);
    });

    it('should not allow non-numeric internal ids', () => {
        expect(() => new InternalId('1' as any)).toThrow(InvalidParameters);
        expect(() => new InternalId('' as any)).toThrow(InvalidParameters);
        expect(() => new InternalId(undefined as any)).toThrow(InvalidParameters);
    });

    it('should not allow zero or negative internal ids', () => {
        expect(() => new InternalId(0)).toThrow(InvalidParameters);
        expect(() => new InternalId(-1)).toThrow(InvalidParameters);
        expect(() => new InternalId(-10)).toThrow(InvalidParameters);
    });
});
