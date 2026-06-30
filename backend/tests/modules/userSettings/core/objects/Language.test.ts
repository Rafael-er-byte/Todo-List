import { describe, expect, it } from 'vitest';
import Language from '../../../../../src/modules/userSettings/core/objects/Language';
import UnsupportedLanguage from '../../../../../src/modules/userSettings/core/errors/UnsupportedLanguage';
import { AllowedLanguage, type AllowedLanguage as AllowedLanguageType } from '../../../../../src/modules/userSettings/core/types/Language';

describe('Language value object', () => {
  it('accepts valid language values', () => {
    const language = new Language(AllowedLanguage.en);

    expect(language.getLanguage()).toBe(AllowedLanguage.en);
  });

  it('throws for unsupported language', () => {
    expect(() => new Language('PT' as AllowedLanguageType)).toThrow(UnsupportedLanguage);
    expect(() => new Language('PT' as AllowedLanguageType)).toThrow('Unsupported language: PT');
  });
});
