import DomainEvent from '../../../shared/core/events/DomainEvent';
export default class ListMovedWithinProject extends DomainEvent {
    constructor(key, date, actor, idProject, idList, newPosition) {
        super(key, date, actor, idProject, idProject, 'LIST_MOVED_WITHIN_PROJECT', { idList, newPosition });
    }
}
//# sourceMappingURL=ListMovedWithinProject.js.map