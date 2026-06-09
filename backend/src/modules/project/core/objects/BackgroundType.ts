import ValueObject from '../../../shared/core/objects/ValueObject';
import BackgroundTypeNotSupported from '../errors/BackgroundTypeNotSupported';
import { ALLOWED_BACKGROUND_TYPE, AllowedBackgroundType } from '../types/AllowedBackgroundType';

export default class BackgroundType extends ValueObject {
  private type!: AllowedBackgroundType;

  private constructor(type: AllowedBackgroundType) {
    super();
    if (!ALLOWED_BACKGROUND_TYPE.includes(type)) throw new BackgroundTypeNotSupported(type);
    this.type = type;
  }

  public static create(type: AllowedBackgroundType): BackgroundType {
    return new BackgroundType(type);
  }

  public static image(): BackgroundType {
    return new BackgroundType(AllowedBackgroundType.image);
  }

  public static color(): BackgroundType {
    return new BackgroundType(AllowedBackgroundType.color);
  }

  public getType(): AllowedBackgroundType {
    return this.type;
  }

  public isImage(): boolean {
    return this.type === AllowedBackgroundType.image;
  }

  public isColor(): boolean {
    return this.type === AllowedBackgroundType.color;
  }
}
