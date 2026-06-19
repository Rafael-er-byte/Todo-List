import ResourceNotFound from '../errors/ResourceNotFound';
import type DomainEvent from '../events/DomainEvent';
import DateTime from '../objects/DateTime';
import DeletedAt from '../objects/DeletedAt';
import type IdEntity from '../objects/IdEntity';

export default abstract class Entity {
  private tmpHistory: DomainEvent[] = [];
  private lastUpdate!: DateTime;
  private deletedAt!: DeletedAt;
  private readonly idEntity!: IdEntity;

  protected constructor(idEntity: IdEntity) {
    this.idEntity = idEntity;
  }

  protected addEvent(event: DomainEvent): void {
    if(!this.deletedAt.exists()){
      throw new ResourceNotFound("Cannot add event to a deleted entity", {idEntity: this.idEntity.getID()});
    }

    this.tmpHistory.push(event);
    this.lastUpdate = event.getDate();
  }

  protected create(): void {
    this.deletedAt = DeletedAt.createActive();
  }

  protected build(deletedAt: DeletedAt): void {
    this.deletedAt = deletedAt;
  }

  protected softDelete(): void {
    this.deletedAt = DeletedAt.delete();
  }

  public pullEvents(): DomainEvent[] {
    const events = this.tmpHistory;
    this.tmpHistory = [];
    return events;
  }

  public getLastUpdate(): DateTime {
    return this.lastUpdate;
  }

  public getDeletedAt(): DeletedAt {
    return this.deletedAt;
  }

  public exists(): boolean {
    return this.deletedAt.exists();
  }

  public getID(): IdEntity{
    return this.idEntity;
  }

  abstract toPrimitives(): unknown;
}
