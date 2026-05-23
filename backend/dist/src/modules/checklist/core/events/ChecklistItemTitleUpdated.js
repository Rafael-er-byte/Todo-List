import DomainEvent from '../../../shared/core/events/DomainEvent';
import DateTime from '../../../shared/core/objects/DateTime';
export default class ChecklistItemTitleUpdated extends DomainEvent {
    constructor(key, date, actor, ownerId, idCheckList, info) {
        super(key, date, actor, ownerId, idCheckList, 'CHECKLIST_ITEM_TITLE_UPDATED', info);
    }
}
//# sourceMappingURL=ChecklistItemTitleUpdated.js.map