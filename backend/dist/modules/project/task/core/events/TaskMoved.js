import DomainEvent from '../../../../shared/core/events/DomainEvent';
export default class TaskMoved extends DomainEvent {
    constructor(key, date, actor, idProject, idTask, list, newPositionInList) {
        super(key, date, actor, idProject, idTask, 'TASK_MOVED', { list: list.getID(), newPositionInList: newPositionInList.getValue() });
    }
}
//# sourceMappingURL=TaskMoved.js.map