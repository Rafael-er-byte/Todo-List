import Entity from '../../../../shared/core/model/Entity';
import IdEntity from '../../../../shared/core/objects/IdEntity';
import IdInvitation from '../objects/IdInvitation';
import InvitationStatus, { AllowedInvitationStatus } from '../objects/InvitationStatus';
import Email from '../../../../shared/core/objects/Email';
export default class Invitation extends Entity {
    constructor(id, host, projectId, status, guest) {
        super(id);
        this.host = host;
        this.projectId = projectId;
        this.status = status;
        this.guest = guest;
    }
    static create(params) {
        const id = new IdInvitation(params.id);
        const host = new IdEntity(params.host);
        const projectId = new IdEntity(params.projectId);
        const guest = new Email(params.guest);
        const invitation = new Invitation(id, host, projectId, InvitationStatus.pending(), guest);
        return invitation;
    }
    cancel() {
        this.status = InvitationStatus.canceled();
    }
    accept() {
        this.status = InvitationStatus.accepted();
    }
    static fromPrimitives(params) {
        return new Invitation(new IdInvitation(params.id), new IdEntity(params.host), new IdEntity(params.projectId), InvitationStatus.create(params.status), new Email(params.guest));
    }
    toPrimitives() {
        return {
            id: super.getID().toString(),
            host: this.host.toString(),
            projectId: this.projectId.toString(),
            status: this.status.getStatus(),
            guest: this.guest.getEmail(),
        };
    }
    getHost() {
        return this.host;
    }
    getProjectId() {
        return this.projectId;
    }
    getStatus() {
        return this.status;
    }
    getGuest() {
        return this.guest;
    }
}
//# sourceMappingURL=Invitation.js.map