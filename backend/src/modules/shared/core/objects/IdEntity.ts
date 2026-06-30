import ID from './ID';

export default class IdEntity {
  private id!: ID;

  constructor(id: string) {
    this.id = ID.fromString(id);
  }

  public getID(): string {
    return this.id.toString();
  }
}
