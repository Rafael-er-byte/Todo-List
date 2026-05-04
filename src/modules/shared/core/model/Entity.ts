import ResourceNotFound from '../errors/ResourceNotFound';
import type DomainEvent from '../events/DomainEvent';
import DateTime from '../objects/DateTime';
import DeletedAt from '../objects/DeletedAt';
import type IdEntity from '../objects/IdEntity';
import type InternalId from '../objects/InternalId';
import type Version from '../objects/Version';
import type EntityPrimitives from './contracts/EntityPrimitives';

export default abstract class Entity {
  private tmpHistory: DomainEvent[] = [];
  private lastUpdate!: DateTime;
  private version!: Version;
  private deletedAt!: DeletedAt;
  private readonly idEntity!: IdEntity;
  private readonly internalId?: InternalId;

  constructor(version: Version, deletedAt: DeletedAt, idEntity: IdEntity, internalId?: InternalId ) {
    this.version = version;
    this.deletedAt = deletedAt;
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

  protected pullEvents(): DomainEvent[] {
    const events = this.tmpHistory;
    this.tmpHistory = [];
    return events;
  }

  protected getLastUpdate(): DateTime {
    return this.lastUpdate;
  }

  protected getInternalId(): InternalId | undefined {
    return this.internalId;
  }

  protected softDelete(): void {
    this.deletedAt = DeletedAt.delete();
  }

  protected getVersion(): Version{
    return this.version;  
  }

  protected getDeletedAt(): DeletedAt {
    return this.deletedAt;
  }

  protected exists(): boolean {
    return this.deletedAt.exists();
  }

  protected getID(): IdEntity{
    return this.idEntity;
  }

  protected entityPrimitives(): EntityPrimitives{
    const deletedAtValue = this.deletedAt.getDeletedTime();
    return {
      idEntity: this.idEntity.getID(),  
      version: this.version.valueOf(),
      deletedAt: deletedAtValue instanceof DateTime ? deletedAtValue.getDate() as Date: null
    }
  }

  abstract toPrimitives(): unknown;
}
