import type DomainEvent from '../events/DomainEvent';
import DateTime from '../objects/DateTime';
import type IdEntity from '../objects/IdEntity';

export default abstract class Entity<TId = IdEntity> {
  private tmpHistory: DomainEvent[] = [];
  private lastUpdate!: DateTime;
  private readonly idEntity!: TId;

  protected constructor(idEntity: TId) {
    this.idEntity = idEntity;
  }

  protected addEvent(event: DomainEvent): void {
    this.tmpHistory.push(event);
    this.lastUpdate = event.getDate();
  }

  public pullEvents(): DomainEvent[] {
    const events = this.tmpHistory;
    this.tmpHistory = [];
    return events;
  }

  public getLastUpdate(): DateTime {
    return this.lastUpdate;
  }

  public getID(): TId{
    return this.idEntity;
  }

  abstract toPrimitives(): unknown;
}
