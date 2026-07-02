import DomainEvent from '../../../../shared/core/events/DomainEvent';
import type DateTime from '../../../../shared/core/objects/DateTime';
import type IdEntity from '../../../../shared/core/objects/IdEntity';
import type Text from '../../../../shared/core/objects/Text';
export default class ListTitleUpdated extends DomainEvent {
    constructor(key: string, date: DateTime, actor: IdEntity, idProject: IdEntity, idEntity: IdEntity, newTitle: Text);
}
//# sourceMappingURL=ListTitleUpdated.d.ts.map