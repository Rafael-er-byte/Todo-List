import Language from '../../../../../src/modules/userSettings/core/objects/Language';
import UnsupportedLanguage from '../../../../../src/modules/userSettings/core/errors/UnsupportedLanguage';
import { describe, it, expect } from 'vitest';
import { AllowedLanguage } from '../../../../../src/modules/userSettings/core/types/Language';

describe('Language value object', () => {
  it('creates for allowed languages', () => {
    expect(Language.create(AllowedLanguage.en)).toBeInstanceOf(Language);
    expect(Language.create(AllowedLanguage.es)).toBeInstanceOf(Language);
  });

  it('throws for unsupported languages', () => {
    expect(() => Language.create('FR' as any)).toThrow(UnsupportedLanguage);
    expect(() => Language.create('' as any)).toThrow(UnsupportedLanguage);
  });
});
