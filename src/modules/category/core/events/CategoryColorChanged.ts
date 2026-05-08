import DomainEvent from '../../../shared/core/events/DomainEvent';
import type DateTime from '../../../shared/core/objects/DateTime';
import type IdEntity from '../../../shared/core/objects/IdEntity';
import type CategoryColor from '../objects/CategoryColor';

export default class CategoryColorChanged extends DomainEvent {
  constructor(
    key: string,
    date: DateTime,
    actor: IdEntity,
    idProject: IdEntity,
    idEntity: IdEntity,
    newColor: CategoryColor,
  ) {
    super(key, date, actor, idProject, idEntity, 'CATEGORY_COLOR_CHANGED', newColor);
  }
}
