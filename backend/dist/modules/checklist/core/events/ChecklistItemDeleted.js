import DomainEvent from '../../../shared/core/events/DomainEvent';
import DateTime from '../../../shared/core/objects/DateTime';
export default class ChecklistItemDeleted extends DomainEvent {
    constructor(key, date, actor, ownerId, idCheckList, info) {
        super(key, date, actor, ownerId, idCheckList, 'CHECKLIST_ITEM_DELETED', info);
    }
}
//# sourceMappingURL=ChecklistItemDeleted.js.map