import DomainEvent from '../../../shared/core/events/DomainEvent';
import type DateTime from '../../../shared/core/objects/DateTime';
import type IdEntity from '../../../shared/core/objects/IdEntity';
import type CategoryName from '../objects/CategoryName';
import ID from '../../../shared/core/objects/ID';

export default class CategoryNameChanged extends DomainEvent {
  constructor(
    date: DateTime,
    actor: IdEntity,
    idProject: IdEntity,
    idEntity: IdEntity,
    newName: CategoryName,
  ) {
    super(ID.generateId(), date, actor, idProject, idEntity, 'CATEGORY_NAME_CHANGED', newName);
  }
}
