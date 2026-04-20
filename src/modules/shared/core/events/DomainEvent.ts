import type Actor from '../model/contracts/Actor';
import type DateTime from '../objects/DateTime';
import ID from '../objects/ID';
import type IdEntity from '../objects/IdEntity';
import type ProjectInfo from './ProjectInfo';

export default class DomainEvent {
  private eventId!: ID;
  private eventDate!: DateTime;
  private actor!: Actor;
  private projectInfo!: ProjectInfo;
  private event!: string;
  private idEntity!: IdEntity;
  private info?: unknown;

  constructor(
    eventId: ID,
    eventDate: DateTime,
    actor: Actor,
    projectInfo: ProjectInfo,
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
    this.projectInfo = projectInfo;
  } 
 
  public getActor(): Actor {
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

  public getId(): ID {
    return this.eventId;
  }

  public getIdEntity(): IdEntity {
    return this.idEntity;
  }

  public getprojectInfo(): ProjectInfo {
    return this.projectInfo;
  }
}  
