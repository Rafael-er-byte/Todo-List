import ValueObject from '../../../shared/core/objects/ValueObject';
import { AllowedColors } from '../../../shared/core/types/AllowedColors';
export default class ProjectBackGroundColor extends ValueObject {
    private color;
    constructor(color: AllowedColors);
    getColor(): AllowedColors;
}
//# sourceMappingURL=ProjectBackGroundColor.d.ts.map