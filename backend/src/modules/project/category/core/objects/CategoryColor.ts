import ValueObject from '../../../../shared/core/objects/ValueObject';
import { ALLOWED_COLORS, AllowedColors } from '../../../../shared/core/types/AllowedColors';
import CategoryColorNotSupported from '../error/CategoryColorNotSupported';

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
