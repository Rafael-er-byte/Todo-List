import DomainEvent from '../../../shared/core/events/DomainEvent';
import type DateTime from '../../../shared/core/objects/DateTime';
import type IdEntity from '../../../shared/core/objects/IdEntity';
import type IntNumber from '../../../shared/core/objects/IntNumber';
export default class ListExported extends DomainEvent {
    constructor(key: string, date: DateTime, actor: IdEntity, newProject: IdEntity, idEntity: IdEntity, newPosition: IntNumber);
}
//# sourceMappingURL=ListExported.d.ts.map