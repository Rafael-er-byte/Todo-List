import InvalidParameters from "../../../../../src/modules/shared/core/errors/InvalidParameters";
import IntNumber from "../../../../../src/modules/shared/core/objects/IntNumber";
import { describe, it, expect } from 'vitest';
describe('IntNumber object tests', () => {
    it('Should create a valid instante of IntNumber', () => {
        const num = new IntNumber(2);
        expect(num).toBeInstanceOf(IntNumber);
    });
    it('Should create a valid instante of IntNumber with a negative number', () => {
        const num = new IntNumber(-2);
        expect(num).toBeInstanceOf(IntNumber);
    });
    it('Should throw if the number is no a valid integer number', () => {
        expect(() => new IntNumber('')).toThrow(InvalidParameters);
        expect(() => new IntNumber(2.56)).toThrow(InvalidParameters);
        expect(() => new IntNumber(0.568473939)).toThrow(InvalidParameters);
        expect(() => new IntNumber(-2.56)).toThrow(InvalidParameters);
    });
});
//# sourceMappingURL=IntNumber.test.js.map