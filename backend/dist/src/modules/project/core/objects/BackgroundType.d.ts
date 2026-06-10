import ValueObject from '../../../shared/core/objects/ValueObject';
import { AllowedBackgroundType } from '../types/AllowedBackgroundType';
export default class BackgroundType extends ValueObject {
    private type;
    private constructor();
    static create(type: AllowedBackgroundType): BackgroundType;
    static image(): BackgroundType;
    static color(): BackgroundType;
    getType(): AllowedBackgroundType;
    isImage(): boolean;
    isColor(): boolean;
}
//# sourceMappingURL=BackgroundType.d.ts.map