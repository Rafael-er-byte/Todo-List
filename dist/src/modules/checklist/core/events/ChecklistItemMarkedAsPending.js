import DomainEvent from '../../../shared/core/events/DomainEvent';
import DateTime from '../../../shared/core/objects/DateTime';
export default class ChecklistItemMarkedAsPending extends DomainEvent {
    constructor(key, date, actor, ownerId, idCheckList, info) {
        super(key, date, actor, ownerId, idCheckList, 'CHECKLIST_ITEM_MARKED_AS_PENDING', info);
    }
}
//# sourceMappingURL=ChecklistItemMarkedAsPending.js.map