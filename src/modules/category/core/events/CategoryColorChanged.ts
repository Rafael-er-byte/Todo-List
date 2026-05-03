import DomainEvent from '../../../shared/core/events/DomainEvent';
import type DateTime from '../../../shared/core/objects/DateTime';
import type IdEntity from '../../../shared/core/objects/IdEntity';
import type CategoryColor from '../objects/CategoryColor';
import ID from '../../../shared/core/objects/ID';

export default class CategoryColorChanged extends DomainEvent {
  constructor(
    date: DateTime,
    actor: IdEntity,
    idProject: IdEntity,
    idEntity: IdEntity,
    newColor: CategoryColor,
  ) {
    super(ID.generateId(), date, actor, idProject, idEntity, 'CATEGORY_COLOR_CHANGED', newColor);
  }
}
