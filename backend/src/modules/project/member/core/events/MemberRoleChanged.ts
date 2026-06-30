import DomainEvent from '../../../../shared/core/events/DomainEvent';
import type DateTime from '../../../../shared/core/objects/DateTime';
import type IdEntity from '../../../../shared/core/objects/IdEntity';
import type MemberRole from '../objects/MemberRole';

export default class MemberRoleChanged extends DomainEvent {
  constructor(
    key: string,
    date: DateTime,
    actor: IdEntity,
    idProject: IdEntity,
    idEntity: IdEntity,
    newRole: MemberRole,
  ) {
    super(key, date, actor, idProject, idEntity, 'MEMBER_ROLE_CHANGED', newRole);
  }
}
