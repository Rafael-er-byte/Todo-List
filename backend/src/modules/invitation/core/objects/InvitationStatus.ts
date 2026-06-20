export enum AllowedInvitationStatus {
  ACCEPTED = 'ACCEPTED',
  CANCELED = 'CANCELED',
  PENDING = 'PENDING',
}

export default class InvitationStatus {
  private readonly status: AllowedInvitationStatus;

  constructor(status: AllowedInvitationStatus) {
    this.status = status;
  }

  public static accepted(): InvitationStatus {
    return new InvitationStatus(AllowedInvitationStatus.ACCEPTED);
  }

  public static canceled(): InvitationStatus {
    return new InvitationStatus(AllowedInvitationStatus.CANCELED);
  }

  public static pending(): InvitationStatus {
    return new InvitationStatus(AllowedInvitationStatus.PENDING);
  }

  public static create(status: string): InvitationStatus {
    if (!Object.values(AllowedInvitationStatus).includes(status as AllowedInvitationStatus)) {
      throw new Error(`Invalid invitation status: ${status}`);
    }
    return new InvitationStatus(status as AllowedInvitationStatus);
  }

  public getStatus(): AllowedInvitationStatus {
    return this.status;
  }
}
