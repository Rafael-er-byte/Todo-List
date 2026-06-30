import InvalidParameters from '../../../shared/core/errors/InvalidParameters';

export default class UnsupportedTheme extends InvalidParameters {
  constructor(theme: string) {
    super(`Unsupported theme: ${theme}`);
    Object.setPrototypeOf(this, UnsupportedTheme.prototype);
  }
}
