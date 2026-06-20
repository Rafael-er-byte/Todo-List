import Entity from '../../../shared/core/model/Entity';
import IdEntity from '../../../shared/core/objects/IdEntity';
import IdInvitation from '../objects/IdInvitation';
import InvitationStatus from '../objects/InvitationStatus';
import type InvitationParams from '../interfaces/InvitationParams';
import Email from '../../../shared/core/objects/Email';
export default class Invitation extends Entity {
    private host;
    private projectId;
    private status;
    private guest;
    private constructor();
    static create(key: string, id: IdInvitation, host: IdEntity, projectId: IdEntity, guest: Email): Invitation;
    cancel(key: string): void;
    accept(key: string): void;
    delete(key: string): void;
    static fromPrimitives(params: InvitationParams): Invitation;
    toPrimitives(): InvitationParams;
    getHost(): IdEntity;
    getProjectId(): IdEntity;
    getStatus(): InvitationStatus;
    getGuest(): Email;
}
//# sourceMappingURL=Invitation.d.ts.map