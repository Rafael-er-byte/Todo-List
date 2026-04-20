import type DomainEvent from '../events/DomainEvent';
import DateTime from '../objects/DateTime';
import type DeletedAt from '../objects/DeletedAt';
import type Version from '../objects/Version';

export default abstract class Entity {
  private tmpHistory: DomainEvent[] = [];
  private lastUpdate!: DateTime;
  private version!: Version;
  private deletedAt!: DeletedAt;

  constructor(version: Version, deletedAt: DeletedAt) {
    this.version = version;
    this.deletedAt = deletedAt;
  }

  protected addEvent(event: DomainEvent): void {
    this.tmpHistory.push(event);
    this.lastUpdate = DateTime.now();
    this.version = this.version.increment();
  }

  public pullEvents(): DomainEvent[] {
    const events = this.tmpHistory;
    this.tmpHistory = [];
    return events;
  }

  public getLastUpdate(): DateTime {
    return this.lastUpdate;
  }

  public delete(): void {
    this.deletedAt = this.deletedAt.delete();
  }

  public getVersion(): Version{
    return this.version;  
  }

  public getDeletedAt(): DeletedAt {
    return this.deletedAt;
  }

  public exists(): boolean {
    return this.deletedAt.exists();
  }

  abstract toPrimitives(): unknown;
}
