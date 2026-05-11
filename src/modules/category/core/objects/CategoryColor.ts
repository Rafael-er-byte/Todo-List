import ValueObject from '../../../shared/core/objects/ValueObject';
import CategoryColorNotSupported from '../error/CategoryColorNotSupported';
import { ALLOWED_COLORS, AllowedColors } from '../types/AllowedColors';

export default class CategoryColor extends ValueObject {
  private color!: AllowedColors;

  constructor(color: AllowedColors) {
    super();
    if (!ALLOWED_COLORS.includes(color)) throw new CategoryColorNotSupported(color);
    this.color = color;
  }

  public getColor(): AllowedColors {
    return this.color;
  }
}
