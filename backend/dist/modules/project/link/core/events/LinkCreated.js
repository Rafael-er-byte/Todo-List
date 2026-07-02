import DomainEvent from '../../../../shared/core/events/DomainEvent';
import DateTime from '../../../../shared/core/objects/DateTime';
export default class LinkCreated extends DomainEvent {
    constructor(key, date, actor, idTask, idLink, info) {
        super(key, date, actor, idTask, idLink, 'LINK_CREATED', info);
    }
}
//# sourceMappingURL=LinkCreated.js.map