import type IdEntity from '../../../shared/core/objects/IdEntity';
import DomainEvent from '../../../shared/core/events/DomainEvent';
import DateTime from '../../../shared/core/objects/DateTime';
import type LinkId from '../objects/LinkId';
export default class LinkCreated extends DomainEvent {
    constructor(key: string, date: DateTime, actor: IdEntity, idTask: IdEntity, idLink: LinkId, info: unknown);
}
//# sourceMappingURL=LinkCreated.d.ts.map