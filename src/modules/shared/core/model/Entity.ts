import ResourceNotFound from '../errors/ResourceNotFound';
import Unauthorized from '../errors/Unauthorized';
import type DomainEvent from '../events/DomainEvent';
import DateTime from '../objects/DateTime';
import DeletedAt from '../objects/DeletedAt';
import type IdEntity from '../objects/IdEntity';
import type InternalId from '../objects/InternalId';
import None from '../objects/None';
import Version from '../objects/Version';

export default abstract class Entity {
  private tmpHistory: DomainEvent[] = [];
  private lastUpdate!: DateTime;
  private version!: Version;
  private deletedAt!: DeletedAt;
  private owner!: IdEntity | None;
  private readonly idEntity!: IdEntity;
  private readonly internalId!: InternalId | None;

  protected constructor(idEntity: IdEntity, internalId: InternalId | None, owner: IdEntity | None) {
    this.idEntity = idEntity;
    this.internalId = internalId;
    this.owner = owner;
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

  protected changeOwner(newOwner: IdEntity | None): void{
    this.owner = newOwner;
  }

  public pullEvents(): DomainEvent[] {
    const events = this.tmpHistory;
    this.tmpHistory = [];
    return events;
  }

  public ownership(child: Entity): boolean{
    const isOwned = child.getOwner() instanceof None? false: child.getOwner() === this.idEntity;
    if(!isOwned) throw new Unauthorized(`Resource ${child.getID()} is not owned by ${this.idEntity}`, child);
    return true;
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

  public getOwner(): IdEntity | None{
    return this.owner;
  }

  abstract toPrimitives(): unknown;
}
