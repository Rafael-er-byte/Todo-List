import DomainEvent from '../../../shared/core/events/DomainEvent';
import type DateTime from '../../../shared/core/objects/DateTime';
import type IdEntity from '../../../shared/core/objects/IdEntity';
import type PositiveInteger from '../../../shared/core/objects/PositiveInteger';
import type TaskId from '../objects/TaskId';
export default class TaskMoved extends DomainEvent {
    constructor(key: string, date: DateTime, actor: IdEntity, idProject: IdEntity, idTask: TaskId, list: IdEntity, newPositionInList: PositiveInteger);
}
//# sourceMappingURL=TaskMoved.d.ts.map