import CoreError from '../../../shared/core/errors/CoreError';

export default class CategoryNameMustBeAValidText extends CoreError {
  constructor(info?: unknown) {
    super('The text of category name is not valid', info);
    Object.setPrototypeOf(this, CategoryNameMustBeAValidText.prototype);
  }
}
