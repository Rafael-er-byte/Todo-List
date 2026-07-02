import DomainEvent from '../../../../shared/core/events/DomainEvent';
import type DateTime from '../../../../shared/core/objects/DateTime';
import type IdEntity from '../../../../shared/core/objects/IdEntity';
import type Text from '../../../../shared/core/objects/Text';
export default class TaskDescriptionUpdated extends DomainEvent {
    constructor(key: string, date: DateTime, actor: IdEntity, idProject: IdEntity, idEntity: IdEntity, newDescription: Text);
}
//# sourceMappingURL=TaskDescriptionUpdated.d.ts.map