import DomainEvent from '../../../../shared/core/events/DomainEvent';
import type DateTime from '../../../../shared/core/objects/DateTime';
import type IdEntity from '../../../../shared/core/objects/IdEntity';
export default class TaskStarted extends DomainEvent {
    constructor(key: string, date: DateTime, idProject: IdEntity, idEntity: IdEntity);
}
//# sourceMappingURL=TaskStarted.d.ts.map