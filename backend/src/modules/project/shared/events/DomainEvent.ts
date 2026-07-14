import type DateTime from '../../../shared/core/objects/DateTime';
import type IdEntity from '../../../shared/core/objects/IdEntity';
import type None from '../../../shared/core/objects/None';

export default class DomainEvent {
  private eventId!: string;
  private eventDate!: DateTime;
  private actor!: IdEntity | None;
  private ownerId!: IdEntity;
  private event!: string;
  private idEntity!: IdEntity;
  private info?: unknown;

  constructor(
    eventId: string,
    eventDate: DateTime,
    actor: IdEntity | None,
    ownerId: IdEntity,
    idEntity: IdEntity,
    event: string,
    info?: unknown,
  ) {
    this.actor = actor;
    this.event = event;
    this.eventDate = eventDate;
    if (info) this.info = info;
    this.eventId = eventId;
    this.idEntity = idEntity;
    this.ownerId = ownerId;
  } 
 
  public getActor(): IdEntity | None {
    return this.actor;
  }

  public getDate(): DateTime {
    return this.eventDate;
  }

  public getEvent(): string {
    return this.event;
  }

  public getInfo(): unknown {
    return this.info;
  }

  public getId(): string {
    return this.eventId;
  }

  public getIdEntity(): IdEntity {
    return this.idEntity;
  }

  public getOwnerInfo(): IdEntity {
    return this.ownerId;
  }
}  
