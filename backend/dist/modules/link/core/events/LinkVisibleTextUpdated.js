import DomainEvent from '../../../shared/core/events/DomainEvent';
import DateTime from '../../../shared/core/objects/DateTime';
export default class LinkVisibleTextUpdated extends DomainEvent {
    constructor(key, date, actor, idTask, idLink, visibleText) {
        super(key, date, actor, idTask, idLink, 'LINK_VISIBLE_TEXT_UPDATED', visibleText);
    }
}
//# sourceMappingURL=LinkVisibleTextUpdated.js.map