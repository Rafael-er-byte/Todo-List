import type DateTime from '../objects/DateTime';
import type IdEntity from '../objects/IdEntity';

export default class DomainEvent {
  private eventId!: string;
  private eventDate!: DateTime;
  private actor!: IdEntity;
  private projectId!: IdEntity;
  private event!: string;
  private idEntity!: IdEntity;
  private info?: unknown;

  constructor(
    eventId: string,
    eventDate: DateTime,
    actor: IdEntity,
    projectId: IdEntity,
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
    this.projectId = projectId;
  } 
 
  public getActor(): IdEntity {
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

  public getprojectInfo(): IdEntity {
    return this.projectId;
  }
}  
