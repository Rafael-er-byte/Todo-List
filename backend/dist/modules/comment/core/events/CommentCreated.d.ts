import DomainEvent from '../../../shared/core/events/DomainEvent';
import type DateTime from '../../../shared/core/objects/DateTime';
import type IdEntity from '../../../shared/core/objects/IdEntity';
export default class CommentCreated extends DomainEvent {
    constructor(key: string, date: DateTime, actor: IdEntity, idTask: IdEntity, idEntity: IdEntity, info?: unknown);
}
//# sourceMappingURL=CommentCreated.d.ts.map