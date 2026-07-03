import DomainEvent from '../../../../shared/core/events/DomainEvent';
export default class TaskExported extends DomainEvent {
    constructor(key, date, actor, newProject, idTask, list, newPositionInList) {
        super(key, date, actor, newProject, idTask, 'TASK_EXPORTED', { list: list.toString(), newPositionInList: newPositionInList.getValue() });
    }
}
//# sourceMappingURL=TaskExported.js.map