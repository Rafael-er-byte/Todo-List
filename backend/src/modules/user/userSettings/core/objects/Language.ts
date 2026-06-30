import ValueObject from '../../../../shared/core/objects/ValueObject';
import UnsupportedLanguage from '../errors/UnsupportedLanguage';
import { ALLOWED_LANGUAGES, AllowedLanguage } from '../types/Language';

export default class Language extends ValueObject {
  private language!: AllowedLanguage;

  public constructor(language: AllowedLanguage) {
    super();
    if (!ALLOWED_LANGUAGES.includes(language)) throw new UnsupportedLanguage(language);
    this.language = language;
  }

  public getLanguage(): AllowedLanguage {
    return this.language;
  }
}
