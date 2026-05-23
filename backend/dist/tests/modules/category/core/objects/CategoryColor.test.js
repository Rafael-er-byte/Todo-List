import CategoryColorNotSupported from "../../../../../src/modules/category/core/error/CategoryColorNotSupported";
import CategoryColor from "../../../../../src/modules/category/core/objects/CategoryColor";
import { AllowedColors } from "../../../../../src/modules/category/core/types/AllowedColors";
import { describe, it, expect } from 'vitest';
describe('Category color tests', () => {
    it('Should create a valid instance of category color object', () => {
        const color = new CategoryColor(AllowedColors.BLACK);
        expect(color).toBeInstanceOf(CategoryColor);
    });
    it('Should thorw if the color is not valid', () => {
        expect(() => new CategoryColor('not valid')).toThrow(CategoryColorNotSupported);
        expect(() => new CategoryColor('red')).toThrow(CategoryColorNotSupported);
        expect(() => new CategoryColor('')).toThrow(CategoryColorNotSupported);
    });
});
//# sourceMappingURL=CategoryColor.test.js.map