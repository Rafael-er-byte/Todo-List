import { describe, expect, it } from 'vitest';
import Theme from '../../../../../src/modules/userSettings/core/objects/Theme';
import UnsupportedTheme from '../../../../../src/modules/userSettings/core/errors/UnsupportedTheme';
import { AllowedTheme, type AllowedTheme as AllowedThemeType } from '../../../../../src/modules/userSettings/core/types/Theme';

describe('Theme value object', () => {
  it('accepts valid theme values', () => {
    const theme = new Theme(AllowedTheme.dark);

    expect(theme.getTheme()).toBe(AllowedTheme.dark);
  });

  it('throws for unsupported theme', () => {
    expect(() => new Theme('BLUE' as AllowedThemeType)).toThrow(UnsupportedTheme);
    expect(() => new Theme('BLUE' as AllowedThemeType)).toThrow('Unsupported theme: BLUE');
  });
});
