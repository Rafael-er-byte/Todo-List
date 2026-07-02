import type IdEntity from '../../../../shared/core/objects/IdEntity';
import DomainEvent from '../../../../shared/core/events/DomainEvent';
import DateTime from '../../../../shared/core/objects/DateTime';
export default class LinkDeleted extends DomainEvent {
    constructor(key: string, date: DateTime, actor: IdEntity, idTask: IdEntity, idLink: IdEntity);
}
//# sourceMappingURL=LinkDeleted.d.ts.map