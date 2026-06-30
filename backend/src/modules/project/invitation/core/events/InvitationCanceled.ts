import DomainEvent from '../../../../shared/core/events/DomainEvent';
import IdEntity from '../../../../shared/core/objects/IdEntity';
import DateTime from '../../../../shared/core/objects/DateTime';

export default class InvitationCanceled extends DomainEvent {
  constructor(id: string, date: DateTime, actor: IdEntity, host: IdEntity, invitationId: IdEntity) {
    super(id, date, actor, host, invitationId, 'INVITATION_CANCELED');
  }
}
