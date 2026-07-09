import CategoryColorNotSupported from "../../../../../../src/modules/project/category/core/error/CategoryColorNotSupported";
import CategoryColor from "../../../../../../src/modules/project/category/core/objects/CategoryColor";
import { AllowedColors } from "../../../../../../src/modules/project/category/core/types/AllowedColors";
import { describe, it, expect } from 'vitest';

describe('Category color tests', () => {

    it('Should create a valid instance of category color object', () => {
        const color = new CategoryColor(AllowedColors.BLACK);
        expect(color).toBeInstanceOf(CategoryColor);
    });

    it('Should thorw if the color is not valid', () => {
        expect(() => new CategoryColor('not valid' as AllowedColors)).toThrow(CategoryColorNotSupported);
        expect(() => new CategoryColor('red' as AllowedColors)).toThrow(CategoryColorNotSupported);
        expect(() => new CategoryColor('' as AllowedColors)).toThrow(CategoryColorNotSupported);
    });
});
