import DomainEvent from '../../../shared/core/events/DomainEvent';
import IdEntity from '../../../shared/core/objects/IdEntity';
import DateTime from '../../../shared/core/objects/DateTime';

export default class InvitationCreated extends DomainEvent {
  constructor(id: string, date: DateTime, actor: IdEntity, host: IdEntity, invitationId: IdEntity, primitives: unknown) {
    super(id, date, actor, host, invitationId, 'INVITATION_CREATED', primitives);
  }
}
