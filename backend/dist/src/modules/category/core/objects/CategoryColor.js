import ValueObject from '../../../shared/core/objects/ValueObject';
import { ALLOWED_COLORS, AllowedColors } from '../../../shared/core/types/AllowedColors';
import CategoryColorNotSupported from '../error/CategoryColorNotSupported';
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