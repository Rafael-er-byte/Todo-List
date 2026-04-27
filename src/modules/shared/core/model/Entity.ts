import ResourceNotFound from '../errors/ResourceNotFound';
import type DomainEvent from '../events/DomainEvent';
import DateTime from '../objects/DateTime';
import DeletedAt from '../objects/DeletedAt';
import type IdEntity from '../objects/IdEntity';
import type Version from '../objects/Version';
import type EntityPrimitives from './contracts/EntityPrimitives';

export default abstract class Entity {
  private tmpHistory: DomainEvent[] = [];
  private lastUpdate!: DateTime;
  private version!: Version;
  private deletedAt!: DeletedAt;
  private readonly idEntity!: IdEntity;

  constructor(version: Version, deletedAt: DeletedAt, idEntity: IdEntity) {
    this.version = version;
    this.deletedAt = deletedAt;
    this.idEntity = idEntity;
  }

  protected addEvent(event: DomainEvent): void {
    if(!this.deletedAt.exists()){
      throw new ResourceNotFound("Cannot add event to a deleted entity", {idEntity: this.idEntity.getID()});
    }

    this.tmpHistory.push(event);
    this.lastUpdate = event.getDate();
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
    this.deletedAt = DeletedAt.delete();
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
