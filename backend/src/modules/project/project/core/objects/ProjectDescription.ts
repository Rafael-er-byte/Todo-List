import Text from '../../../../shared/core/objects/Text';
import ValueObject from '../../../../shared/core/objects/ValueObject';

export default class ProjectDescription extends ValueObject {
  private description!: Text;

  constructor(description: string) {
    super();
    this.description = new Text(description);
  }

  public getDescription(): string {
    return this.description.getText();
  }
}
