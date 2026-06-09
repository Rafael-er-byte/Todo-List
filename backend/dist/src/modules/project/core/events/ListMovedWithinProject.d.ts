import DomainEvent from '../../../shared/core/events/DomainEvent';
import type DateTime from '../../../shared/core/objects/DateTime';
import type IdEntity from '../../../shared/core/objects/IdEntity';
import type PositiveInteger from '../../../shared/core/objects/PositiveInteger';
import type ListId from '../../../list/core/object/ListId';
import type ProjectId from '../objects/ProjectId';
export default class ListMovedWithinProject extends DomainEvent {
    constructor(key: string, date: DateTime, actor: IdEntity, idProject: ProjectId, idList: ListId, newPosition: PositiveInteger);
}
//# sourceMappingURL=ListMovedWithinProject.d.ts.map