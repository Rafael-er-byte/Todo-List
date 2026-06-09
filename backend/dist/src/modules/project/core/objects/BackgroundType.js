import ValueObject from '../../../shared/core/objects/ValueObject';
import BackgroundTypeNotSupported from '../errors/BackgroundTypeNotSupported';
import { ALLOWED_BACKGROUND_TYPE, AllowedBackgroundType } from '../types/AllowedBackgroundType';
export default class BackgroundType extends ValueObject {
    constructor(type) {
        super();
        if (!ALLOWED_BACKGROUND_TYPE.includes(type))
            throw new BackgroundTypeNotSupported(type);
        this.type = type;
    }
    static create(type) {
        return new BackgroundType(type);
    }
    static image() {
        return new BackgroundType(AllowedBackgroundType.image);
    }
    static color() {
        return new BackgroundType(AllowedBackgroundType.color);
    }
    getType() {
        return this.type;
    }
    isImage() {
        return this.type === AllowedBackgroundType.image;
    }
    isColor() {
        return this.type === AllowedBackgroundType.color;
    }
}
//# sourceMappingURL=BackgroundType.js.map