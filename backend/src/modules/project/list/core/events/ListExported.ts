import DomainEvent from '../../../../shared/core/events/DomainEvent';
import type DateTime from '../../../../shared/core/objects/DateTime';
import type IdEntity from '../../../../shared/core/objects/IdEntity';
import type PositiveInteger from '../../../../shared/core/objects/PositiveInteger';

export default class ListExported extends DomainEvent {
  constructor(
    key: string,
    date: DateTime,
    actor: IdEntity,
    newProject: IdEntity,
    idEntity: IdEntity,
    newPosition: PositiveInteger
  ) {
    super(key, date, actor, newProject, idEntity, 'LIST_EXPORTED', newPosition);
  }
}
