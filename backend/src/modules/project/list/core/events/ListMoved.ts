import DomainEvent from '../../../shared/events/DomainEvent';
import type DateTime from '../../../../shared/core/objects/DateTime';
import type IdEntity from '../../../../shared/core/objects/IdEntity';
import type PositiveInteger from '../../../../shared/core/objects/PositiveInteger';

export default class ListMoved extends DomainEvent {
  constructor(
    key: string,
    date: DateTime,
    actor: IdEntity,
    idProject: IdEntity,
    idEntity: IdEntity,
    newPosition: PositiveInteger,
  ) {
    super(key, date, actor, idProject, idEntity, 'LIST_MOVED', newPosition);
  }
}
