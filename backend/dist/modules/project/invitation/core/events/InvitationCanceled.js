import DomainEvent from '../../../../shared/core/events/DomainEvent';
import IdEntity from '../../../../shared/core/objects/IdEntity';
import DateTime from '../../../../shared/core/objects/DateTime';
export default class InvitationCanceled extends DomainEvent {
    constructor(id, date, actor, host, invitationId) {
        super(id, date, actor, host, invitationId, 'INVITATION_CANCELED');
    }
}
//# sourceMappingURL=InvitationCanceled.js.map