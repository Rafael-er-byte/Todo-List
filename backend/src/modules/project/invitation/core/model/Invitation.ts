import Entity from '../../../../shared/core/model/Entity';
import IdEntity from '../../../../shared/core/objects/IdEntity';
import IdInvitation from '../objects/IdInvitation';
import InvitationStatus, { AllowedInvitationStatus } from '../objects/InvitationStatus';
import type InvitationParams from '../interfaces/InvitationParams';
import Email from '../../../../shared/core/objects/Email';

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

  public static create(params: Omit<InvitationParams, 'status'> & {  }): Invitation {
    const id = new IdInvitation(params.id);
    const host = new IdEntity(params.host);
    const projectId = new IdEntity(params.projectId);
    const guest = new Email(params.guest);
    const invitation = new Invitation(id, host, projectId, InvitationStatus.pending(), guest);
    return invitation;
  }

  public cancel(): void {
    this.status = InvitationStatus.canceled();
  }

  public accept(): void {
    this.status = InvitationStatus.accepted();
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
      id: super.getID().toString(),
      host: this.host.toString(),
      projectId: this.projectId.toString(),
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
