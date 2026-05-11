import InvalidParameters from '../errors/InvalidParameters';
import ValueObject from './ValueObject';

export default class Text extends ValueObject {
  private text!: string;

  constructor(text: string) {
    super();
    if (!text || typeof text !== 'string' || text.trim().length === 0)
      throw new InvalidParameters('Must be text');
    this.text = text;
  }

  public getText(): string {
    return this.text;
  }

  public size(): number {
    return this.text.length;
  }
}
