import Entity from '../../../shared/core/model/Entity';
import IdEntity from '../../../shared/core/objects/IdEntity';
import DateTime from '../../../shared/core/objects/DateTime';
import IdInvitation from '../objects/IdInvitation';
import InvitationStatus, { AllowedInvitationStatus } from '../objects/InvitationStatus';
import type InvitationParams from '../interfaces/InvitationParams';
import InvitationCreated from '../events/InvitationCreated';
import InvitationCanceled from '../events/InvitationCanceled';
import Email from '../../../shared/core/objects/Email';

export default class Invitation extends Entity {
  private host!: IdEntity;
  private projectId!: IdEntity;
  private status!: InvitationStatus;
  private guest!: Email;

  private constructor(id: IdInvitation, host: IdEntity, projectId: IdEntity, status: InvitationStatus, guest: Email) {
    super(id);
    this.host = host;
    this.projectId = projectId;
    this.status = status;
    this.guest = guest;
  }

  public static create(key: string, id: IdInvitation, host: IdEntity, projectId: IdEntity, guest: Email): Invitation {
    const invitation = new Invitation(id, host, projectId, InvitationStatus.pending(), guest);
    invitation.addEvent(new InvitationCreated(key, DateTime.now(), host, host, id, invitation.toPrimitives()));
    return invitation;
  }

  public cancel(key: string): void {
    this.status = InvitationStatus.canceled();
    this.addEvent(new InvitationCanceled(key, DateTime.now(), this.host, this.host, super.getID()));
  }

  public accept(key: string): void {
    this.status = InvitationStatus.accepted();
  }

  public delete(key: string): void {
    this.addEvent(new InvitationCanceled(key, DateTime.now(), this.host, this.host, super.getID()));
  }

  public static fromPrimitives(params: InvitationParams): Invitation {
    return new Invitation(
      new IdInvitation(params.id),
      new IdEntity(params.host),
      new IdEntity(params.projectId),
      InvitationStatus.create(params.status),
      new Email(params.guest),
    );
  }

  public toPrimitives(): InvitationParams {
    return {
      id: super.getID().getID(),
      host: this.host.getID(),
      projectId: this.projectId.getID(),
      status: this.status.getStatus() as AllowedInvitationStatus,
      guest: this.guest.getEmail(),
    };
  }

  public getHost(): IdEntity {
    return this.host;
  }

  public getProjectId(): IdEntity {
    return this.projectId;
  }

  public getStatus(): InvitationStatus {
    return this.status;
  }

  public getGuest(): Email {
    return this.guest;
  }
}
