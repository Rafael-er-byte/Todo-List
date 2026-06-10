import LimitExceeded from '../../../shared/core/errors/LimitExceeded';
import Text from '../../../shared/core/objects/Text';
import ValueObject from '../../../shared/core/objects/ValueObject';

const MAX_PROJECT_NAME_LENGTH = 1000;

export default class ProjectName extends ValueObject {
  private name!: Text;

  constructor(name: string) {
    super();
    this.name = new Text(name);
    if (this.name.size() > MAX_PROJECT_NAME_LENGTH) {
      throw new LimitExceeded(`Project name cannot be longer than ${MAX_PROJECT_NAME_LENGTH} characters`);
    }
  }

  public getName(): string {
    return this.name.getText();
  }
}
