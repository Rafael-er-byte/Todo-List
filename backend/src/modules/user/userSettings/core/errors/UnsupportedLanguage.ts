import InvalidParameters from '../../../../shared/core/errors/InvalidParameters';

export default class UnsupportedLanguage extends InvalidParameters {
  constructor(language: string) {
    super(`Unsupported language: ${language}`);
    Object.setPrototypeOf(this, UnsupportedLanguage.prototype);
  }
}
