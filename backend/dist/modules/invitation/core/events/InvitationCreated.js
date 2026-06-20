import DomainEvent from '../../../shared/core/events/DomainEvent';
import IdEntity from '../../../shared/core/objects/IdEntity';
import DateTime from '../../../shared/core/objects/DateTime';
export default class InvitationCreated extends DomainEvent {
    constructor(id, date, actor, host, invitationId, primitives) {
        super(id, date, actor, host, invitationId, 'INVITATION_CREATED', primitives);
    }
}
//# sourceMappingURL=InvitationCreated.js.map