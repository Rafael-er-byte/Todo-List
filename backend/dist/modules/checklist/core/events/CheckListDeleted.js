import DomainEvent from '../../../shared/core/events/DomainEvent';
import DateTime from '../../../shared/core/objects/DateTime';
export default class CheckListDeleted extends DomainEvent {
    constructor(key, date, actor, ownerId, idCheckList) {
        super(key, date, actor, ownerId, idCheckList, 'CHECKLIST_DELETED');
    }
}
//# sourceMappingURL=CheckListDeleted.js.map