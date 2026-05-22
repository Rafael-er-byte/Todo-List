import ValueObject from '../../../shared/core/objects/ValueObject';
import CategoryColorNotSupported from '../error/CategoryColorNotSupported';
import { ALLOWED_COLORS, AllowedColors } from '../types/AllowedColors';
export default class CategoryColor extends ValueObject {
    constructor(color) {
        super();
        if (!ALLOWED_COLORS.includes(color))
            throw new CategoryColorNotSupported(color);
        this.color = color;
    }
    getColor() {
        return this.color;
    }
}
//# sourceMappingURL=CategoryColor.js.map