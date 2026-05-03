import DomainEvent from '../../../shared/core/events/DomainEvent';
import type DateTime from '../../../shared/core/objects/DateTime';
import type IdEntity from '../../../shared/core/objects/IdEntity';
import ID from '../../../shared/core/objects/ID';
import type CategoryParams from '../interfaces/CategoryParams';

export default class CategoryCreated extends DomainEvent {
  constructor(
    date: DateTime,
    actor: IdEntity,
    idProject: IdEntity,
    idEntity: IdEntity,
    categoryParams: CategoryParams
  ) {
    super(ID.generateId(), date, actor, idProject, idEntity, 'CATEGORY_CREATED', categoryParams);
  }
}
