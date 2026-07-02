import DomainEvent from '../../../../shared/core/events/DomainEvent';
import DateTime from '../../../../shared/core/objects/DateTime';
export default class ChecklistItemCreated extends DomainEvent {
    constructor(key, date, actor, ownerId, idCheckList, info) {
        super(key, date, actor, ownerId, idCheckList, 'CHECKLIST_ITEM_CREATED', info);
    }
}
//# sourceMappingURL=ChecklistItemCreated.js.map