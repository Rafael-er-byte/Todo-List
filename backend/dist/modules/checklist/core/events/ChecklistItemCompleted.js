import DomainEvent from '../../../shared/core/events/DomainEvent';
import DateTime from '../../../shared/core/objects/DateTime';
export default class ChecklistItemCompleted extends DomainEvent {
    constructor(key, date, actor, ownerId, idCheckList, info) {
        super(key, date, actor, ownerId, idCheckList, 'CHECKLIST_ITEM_COMPLETED', info);
    }
}
//# sourceMappingURL=ChecklistItemCompleted.js.map