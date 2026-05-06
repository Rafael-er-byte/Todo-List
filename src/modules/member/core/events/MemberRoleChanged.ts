import DomainEvent from '../../../shared/core/events/DomainEvent';
import type DateTime from '../../../shared/core/objects/DateTime';
import type IdEntity from '../../../shared/core/objects/IdEntity';
import type MemberRole from '../objects/MemberRole';
import ID from '../../../shared/core/objects/ID';

export default class MemberChangedRole extends DomainEvent {
  constructor(
    date: DateTime,
    actor: IdEntity,
    idProject: IdEntity,
    idEntity: IdEntity,
    newRole: MemberRole,
  ) {
    super(ID.generateId(), date, actor, idProject, idEntity, 'MEMBER_CHANGED_ROLE', newRole);
  }
}
