import ValueObject from '../../../shared/core/objects/ValueObject';
import { AllowedColors } from '../types/AllowedColors';
export default class CategoryColor extends ValueObject {
    private color;
    constructor(color: AllowedColors);
    getColor(): AllowedColors;
}
//# sourceMappingURL=CategoryColor.d.ts.map