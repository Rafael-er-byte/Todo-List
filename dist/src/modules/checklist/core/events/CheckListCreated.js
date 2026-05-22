import DomainEvent from '../../../shared/core/events/DomainEvent';
import DateTime from '../../../shared/core/objects/DateTime';
export default class CheckListCreated extends DomainEvent {
    constructor(key, date, actor, ownerId, idCheckList, info) {
        super(key, date, actor, ownerId, idCheckList, 'CHECKLIST_CREATED', info);
    }
}
//# sourceMappingURL=CheckListCreated.js.map