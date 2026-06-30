import ValueObject from '../../../../shared/core/objects/ValueObject';
import Text from '../../../../shared/core/objects/Text';

export default class AccountName extends ValueObject {
  private readonly name: Text;

  constructor(name: string) {
    super();
    this.name = new Text(name);
  }

  public getName(): string {
    return this.name.getText();
  }

  public toPrimitives(): string {
    return this.name.getText();
  }
}
