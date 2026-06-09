import CoreError from '../../../shared/core/errors/CoreError';

export default class ProjectBackgroundColorNotSupported extends CoreError {
  constructor(color: string) {
    super('Project background color is not supported', { color });
    Object.setPrototypeOf(this, ProjectBackgroundColorNotSupported.prototype);
  }
}
