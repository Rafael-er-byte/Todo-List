import DomainEvent from '../../../shared/core/events/DomainEvent';
import type DateTime from '../../../shared/core/objects/DateTime';
import type IdEntity from '../../../shared/core/objects/IdEntity';
import type IntNumber from '../../../shared/core/objects/IntNumber';
import type TaskId from '../objects/TaskId';

export default class TaskExported extends DomainEvent {
  constructor(
    key: string,
    date: DateTime,
    actor: IdEntity,
    newProject: IdEntity,
    idTask: TaskId,
    list: IdEntity,
    newPositionInList: IntNumber
  ) {
    super(key, date, actor, newProject, idTask, 'TASK_EXPORTED', { list: list.getID(), newPositionInList: newPositionInList.getValue() });
  }
}
