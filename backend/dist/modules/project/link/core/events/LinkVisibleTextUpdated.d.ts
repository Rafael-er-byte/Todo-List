import type IdEntity from '../../../../shared/core/objects/IdEntity';
import DomainEvent from '../../../../shared/core/events/DomainEvent';
import DateTime from '../../../../shared/core/objects/DateTime';
import type Text from '../../../../shared/core/objects/Text';
export default class LinkVisibleTextUpdated extends DomainEvent {
    constructor(key: string, date: DateTime, actor: IdEntity, idTask: IdEntity, idLink: IdEntity, visibleText: Text);
}
//# sourceMappingURL=LinkVisibleTextUpdated.d.ts.map