import DomainEvent from '../../../../shared/core/events/DomainEvent';
import type DateTime from '../../../../shared/core/objects/DateTime';
import type IdEntity from '../../../../shared/core/objects/IdEntity';
import type CategoryName from '../objects/CategoryName';
export default class CategoryNameChanged extends DomainEvent {
    constructor(key: string, date: DateTime, actor: IdEntity, idProject: IdEntity, idEntity: IdEntity, newName: CategoryName);
}
//# sourceMappingURL=CategoryNameChanged.d.ts.map