import ValueObject from '../../../../shared/core/objects/ValueObject';
import { ALLOWED_COLORS, AllowedColors } from '../../../../shared/core/types/AllowedColors';
import ProjectBackgroundColorNotSupported from '../errors/ProjectBackgroundColorNotSupported';
export default class ProjectBackGroundColor extends ValueObject {
    constructor(color) {
        super();
        if (!ALLOWED_COLORS.includes(color))
            throw new ProjectBackgroundColorNotSupported(color);
        this.color = color;
    }
    getColor() {
        return this.color;
    }
}
//# sourceMappingURL=ProjectBackGroundColor.js.map