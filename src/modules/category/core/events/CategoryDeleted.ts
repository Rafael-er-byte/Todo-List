import DomainEvent from '../../../shared/core/events/DomainEvent';
import type DateTime from '../../../shared/core/objects/DateTime';
import type IdEntity from '../../../shared/core/objects/IdEntity';
import ID from '../../../shared/core/objects/ID';

export default class CategoryDeleted extends DomainEvent {
  constructor(
    date: DateTime,
    actor: IdEntity,
    idProject: IdEntity,
    idEntity: IdEntity
  ) {
    super(ID.generateId(), date, actor, idProject, idEntity, 'CATEGORY_DELETED');
  }
}
