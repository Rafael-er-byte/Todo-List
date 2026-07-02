import DomainEvent from '../../../../shared/core/events/DomainEvent';
import type DateTime from '../../../../shared/core/objects/DateTime';
import type IdEntity from '../../../../shared/core/objects/IdEntity';
import type PositiveInteger from '../../../../shared/core/objects/PositiveInteger';
export default class ListMoved extends DomainEvent {
    constructor(key: string, date: DateTime, actor: IdEntity, idProject: IdEntity, idEntity: IdEntity, newPosition: PositiveInteger);
}
//# sourceMappingURL=ListMoved.d.ts.map