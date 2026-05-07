import ResourceNotFound from '../errors/ResourceNotFound';
import type DomainEvent from '../events/DomainEvent';
import DateTime from '../objects/DateTime';
import DeletedAt from '../objects/DeletedAt';
import type IdEntity from '../objects/IdEntity';
import type InternalId from '../objects/InternalId';
import type None from '../objects/None';
import Version from '../objects/Version';

export default abstract class Entity {
  private tmpHistory: DomainEvent[] = [];
  private lastUpdate!: DateTime;
  private version!: Version;
  private deletedAt!: DeletedAt;
  private readonly idEntity!: IdEntity;
  private readonly internalId!: InternalId | None;

  protected constructor(idEntity: IdEntity, internalId: InternalId | None) {
    this.idEntity = idEntity;
    if(internalId){
      this.internalId = internalId;
    }
  }

  protected addEvent(event: DomainEvent): void {
    if(!this.deletedAt.exists()){
      throw new ResourceNotFound("Cannot add event to a deleted entity", {idEntity: this.idEntity.getID()});
    }

    this.tmpHistory.push(event);
    this.lastUpdate = event.getDate();
    this.version = this.version.increment();
  }

  protected create(): void {
    this.version = new Version(0);
    this.deletedAt = DeletedAt.createActive();
  }

  protected build(version: Version, deletedAt: DeletedAt): void {
    this.version = version;
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

  public getInternalId(): InternalId | None {
    return this.internalId;
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

  public getID(): IdEntity{
    return this.idEntity;
  }

  abstract toPrimitives(): unknown;
}
