import DomainEvent from '../../../shared/core/events/DomainEvent';
import type DateTime from '../../../shared/core/objects/DateTime';
import type IdEntity from '../../../shared/core/objects/IdEntity';
import type iTaskParams from '../interface/TaskParams';
export default class TaskCreated extends DomainEvent {
    constructor(key: string, date: DateTime, actor: IdEntity, idProject: IdEntity, idEntity: IdEntity, taskParams: iTaskParams);
}
//# sourceMappingURL=TaskCreated.d.ts.map