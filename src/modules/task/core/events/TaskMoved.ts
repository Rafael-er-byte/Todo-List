import DomainEvent from '../../../shared/core/events/DomainEvent';
import type DateTime from '../../../shared/core/objects/DateTime';
import type IdEntity from '../../../shared/core/objects/IdEntity';
import type IntNumber from '../../../shared/core/objects/IntNumber';

export default class TaskMoved extends DomainEvent {
  constructor(
    key: string,
    date: DateTime,
    actor: IdEntity,
    idProject: IdEntity,
    idEntity: IdEntity,
    newPosition: IdEntity,
    positionInList: IntNumber
  ) {
    super(key, date, actor, idProject, idEntity, 'TASK_MOVED', {
      newPosition: newPosition.getID(),
      positionInList: positionInList.getValue()
    });
  }
}
