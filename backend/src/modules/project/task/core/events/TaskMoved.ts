import DomainEvent from '../../../shared/events/DomainEvent';
import type DateTime from '../../../../shared/core/objects/DateTime';
import type IdEntity from '../../../../shared/core/objects/IdEntity';
import type PositiveInteger from '../../../../shared/core/objects/PositiveInteger';
import type TaskId from '../objects/TaskId';

export default class TaskMoved extends DomainEvent {
  constructor(
    key: string,
    date: DateTime,
    actor: IdEntity,
    idProject: IdEntity,
    idTask: TaskId,
    list: IdEntity,
    newPositionInList: PositiveInteger
  ) {
    super(key, date, actor, idProject, idTask, 'TASK_MOVED', { list: list.toString(), newPositionInList: newPositionInList.getValue() });
  }
}
