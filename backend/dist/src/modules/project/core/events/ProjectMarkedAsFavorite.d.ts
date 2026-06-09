import DomainEvent from '../../../shared/core/events/DomainEvent';
import type DateTime from '../../../shared/core/objects/DateTime';
import type IdEntity from '../../../shared/core/objects/IdEntity';
import type ProjectId from '../objects/ProjectId';
export default class ProjectMarkedAsFavorite extends DomainEvent {
    constructor(key: string, date: DateTime, actor: IdEntity, idProject: ProjectId);
}
//# sourceMappingURL=ProjectMarkedAsFavorite.d.ts.map