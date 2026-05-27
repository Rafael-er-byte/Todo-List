import DomainEvent from '../../../shared/core/events/DomainEvent';
import type DateTime from '../../../shared/core/objects/DateTime';
import type IdEntity from '../../../shared/core/objects/IdEntity';
import type Attachment from '../../../shared/core/objects/Attachment';
export default class TaskAttachmentCreated extends DomainEvent {
    constructor(key: string, date: DateTime, actor: IdEntity, idTask: IdEntity, idEntity: IdEntity, attachment: Attachment);
}
//# sourceMappingURL=TaskAttachmentCreated.d.ts.map