import DomainEvent from '../../../shared/core/events/DomainEvent';
import DateTime from '../../../shared/core/objects/DateTime';
export default class LinkDeleted extends DomainEvent {
    constructor(key, date, actor, idTask, idLink) {
        super(key, date, actor, idTask, idLink, 'LINK_DELETED');
    }
}
//# sourceMappingURL=LinkDeleted.js.map