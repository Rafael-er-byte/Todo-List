import DomainEvent from '../../../shared/core/events/DomainEvent';
import type DateTime from '../../../shared/core/objects/DateTime';
import type IdEntity from '../../../shared/core/objects/IdEntity';
import type iMemberParams from '../interfaces/MemberParams';
import ID from '../../../shared/core/objects/ID';

export default class MemberAddedToProject extends DomainEvent {
  constructor(
    date: DateTime,
    actor: IdEntity,
    idProject: IdEntity,
    idEntity: IdEntity,
    params: iMemberParams,
  ) {
    super(ID.generateId(), date, actor, idProject, idEntity, 'MEMBER_ADDED_TO_PROJECT', params);
  }
}
