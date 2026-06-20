import DomainEvent from '../../../shared/core/events/DomainEvent';
import type DateTime from '../../../shared/core/objects/DateTime';
import type IdEntity from '../../../shared/core/objects/IdEntity';
export default class TaskMemberAdded extends DomainEvent {
    constructor(key: string, date: DateTime, actor: IdEntity, idProject: IdEntity, idEntity: IdEntity, assigned: IdEntity);
}
//# sourceMappingURL=TaskMemberAdded.d.ts.map