import Theme from '../../../../../src/modules/userSettings/core/objects/Theme';
import UnsupportedTheme from '../../../../../src/modules/userSettings/core/errors/UnsupportedTheme';
import { describe, it, expect } from 'vitest';
import { AllowedTheme } from '../../../../../src/modules/userSettings/core/types/Theme';

describe('Theme value object', () => {
  it('creates for allowed themes', () => {
    expect(Theme.create(AllowedTheme.dark)).toBeInstanceOf(Theme);
    expect(Theme.create(AllowedTheme.light)).toBeInstanceOf(Theme);
  });

  it('throws for unsupported themes', () => {
    expect(() => Theme.create('BLUE' as any)).toThrow(UnsupportedTheme);
    expect(() => Theme.create('' as any)).toThrow(UnsupportedTheme);
  });
});
