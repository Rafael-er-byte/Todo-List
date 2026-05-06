import DomainEvent from '../../../shared/core/events/DomainEvent';
import type DateTime from '../../../shared/core/objects/DateTime';
import type IdEntity from '../../../shared/core/objects/IdEntity';
import ID from '../../../shared/core/objects/ID';

export default class MemberDeleted extends DomainEvent {
  constructor(date: DateTime, actor: IdEntity, idProject: IdEntity, idEntity: IdEntity) {
    super(ID.generateId(), date, actor, idProject, idEntity, 'MEMBER_DELETED');
  }
}
