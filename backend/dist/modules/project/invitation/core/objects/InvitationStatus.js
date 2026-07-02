export var AllowedInvitationStatus;
(function (AllowedInvitationStatus) {
    AllowedInvitationStatus["ACCEPTED"] = "ACCEPTED";
    AllowedInvitationStatus["CANCELED"] = "CANCELED";
    AllowedInvitationStatus["PENDING"] = "PENDING";
})(AllowedInvitationStatus || (AllowedInvitationStatus = {}));
export default class InvitationStatus {
    constructor(status) {
        this.status = status;
    }
    static accepted() {
        return new InvitationStatus(AllowedInvitationStatus.ACCEPTED);
    }
    static canceled() {
        return new InvitationStatus(AllowedInvitationStatus.CANCELED);
    }
    static pending() {
        return new InvitationStatus(AllowedInvitationStatus.PENDING);
    }
    static create(status) {
        if (!Object.values(AllowedInvitationStatus).includes(status)) {
            throw new Error(`Invalid invitation status: ${status}`);
        }
        return new InvitationStatus(status);
    }
    getStatus() {
        return this.status;
    }
}
//# sourceMappingURL=InvitationStatus.js.map