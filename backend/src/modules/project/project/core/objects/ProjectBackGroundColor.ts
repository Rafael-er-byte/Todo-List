import ValueObject from '../../../../shared/core/objects/ValueObject';
import { ALLOWED_COLORS, AllowedColors } from '../../../../shared/core/types/AllowedColors';
import ProjectBackgroundColorNotSupported from '../errors/ProjectBackgroundColorNotSupported';

export default class ProjectBackGroundColor extends ValueObject {
  private color!: AllowedColors;

  constructor(color: AllowedColors) {
    super();
    if (!ALLOWED_COLORS.includes(color)) throw new ProjectBackgroundColorNotSupported(color);
    this.color = color;
  }

  public getColor(): AllowedColors {
    return this.color;
  }
}
