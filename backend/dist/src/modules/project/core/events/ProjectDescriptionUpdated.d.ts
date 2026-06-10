import DomainEvent from '../../../shared/core/events/DomainEvent';
import type DateTime from '../../../shared/core/objects/DateTime';
import type IdEntity from '../../../shared/core/objects/IdEntity';
import type None from '../../../shared/core/objects/None';
import type ProjectDescription from '../objects/ProjectDescription';
import type ProjectId from '../objects/ProjectId';
export default class ProjectDescriptionUpdated extends DomainEvent {
    constructor(key: string, date: DateTime, actor: IdEntity, idProject: ProjectId, newDescription: ProjectDescription | None);
}
//# sourceMappingURL=ProjectDescriptionUpdated.d.ts.map