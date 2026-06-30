import ValueObject from '../../../shared/core/objects/ValueObject';
import UnsupportedTheme from '../errors/UnsupportedTheme';
import { ALLOWED_THEMES, AllowedTheme } from '../types/Theme';

export default class Theme extends ValueObject {
  private theme!: AllowedTheme;

  public constructor(theme: AllowedTheme) {
    super();
    if (!ALLOWED_THEMES.includes(theme)) throw new UnsupportedTheme(theme);
    this.theme = theme;
  }

  public getTheme(): AllowedTheme {
    return this.theme;
  }
}
