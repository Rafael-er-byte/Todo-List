import DomainEvent from '../../../../shared/core/events/DomainEvent';
import DateTime from '../../../../shared/core/objects/DateTime';
export default class CheckListTitleUpdated extends DomainEvent {
    constructor(key, date, actor, ownerId, idCheckList, info) {
        super(key, date, actor, ownerId, idCheckList, 'CHECKLIST_TITLE_UPDATED', info);
    }
}
//# sourceMappingURL=CheckListTitleUpdated.js.map