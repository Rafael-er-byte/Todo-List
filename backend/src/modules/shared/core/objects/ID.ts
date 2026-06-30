import InvalidFormat from '../errors/InvalidFormat';
import Text from './Text';
import ValueObject from './ValueObject';
import { v7 as uuidv7 } from 'uuid';

export default class ID extends ValueObject {
  private id!: Text;

  private constructor(id: string) {
    super();
    this.id = new Text(id);
  }

  private validateId(): boolean{
    const uuidV7Regex = /^[0-9a-f]{8}-[0-9a-f]{4}-7[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return uuidV7Regex.test(this.id.getText());
  }

  static generateId(): ID {
    const uuid = uuidv7();
    return new ID(uuid);
  }

  static fromString(id: string): ID {
    const tmpID = new ID(id);
    if(!tmpID.validateId()) throw new InvalidFormat('Invalid ID format. Expected a UUIDv7 string.', { id });
    return tmpID;
  }

  public toString(): string {
    return this.id.getText();
  }
}
