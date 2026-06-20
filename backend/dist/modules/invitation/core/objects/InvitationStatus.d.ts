export declare enum AllowedInvitationStatus {
    ACCEPTED = "ACCEPTED",
    CANCELED = "CANCELED",
    PENDING = "PENDING"
}
export default class InvitationStatus {
    private readonly status;
    constructor(status: AllowedInvitationStatus);
    static accepted(): InvitationStatus;
    static canceled(): InvitationStatus;
    static pending(): InvitationStatus;
    static create(status: string): InvitationStatus;
    getStatus(): AllowedInvitationStatus;
}
//# sourceMappingURL=InvitationStatus.d.ts.map