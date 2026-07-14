import DomainEvent from '../../../shared/events/DomainEvent';
import type DateTime from '../../../../shared/core/objects/DateTime';
import type IdEntity from '../../../../shared/core/objects/IdEntity';
import type PositiveInteger from '../../../../shared/core/objects/PositiveInteger';
import type TaskId from '../objects/TaskId';

export default class TaskExported extends DomainEvent {
  constructor(
    key: string,
    date: DateTime,
    actor: IdEntity,
    newProject: IdEntity,
    idTask: TaskId,
    list: IdEntity,
    newPositionInList: PositiveInteger
  ) {
    super(key, date, actor, newProject, idTask, 'TASK_EXPORTED', { list: list.toString(), newPositionInList: newPositionInList.getValue() });
  }
}
