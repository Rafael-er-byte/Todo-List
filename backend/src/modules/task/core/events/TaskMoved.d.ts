import DomainEvent from '../../../shared/core/events/DomainEvent';
import type DateTime from '../../../shared/core/objects/DateTime';
import type IdEntity from '../../../shared/core/objects/IdEntity';
import type IntNumber from '../../../shared/core/objects/IntNumber';
import type TaskId from '../objects/TaskId';
export default class TaskMoved extends DomainEvent {
    constructor(key: string, date: DateTime, actor: IdEntity, idProject: IdEntity, idTask: TaskId, list: IdEntity, newPositionInList: IntNumber);
}
//# sourceMappingURL=TaskMoved.d.ts.map