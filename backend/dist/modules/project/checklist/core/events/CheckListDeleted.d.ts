import type IdEntity from '../../../../shared/core/objects/IdEntity';
import DomainEvent from '../../../../shared/core/events/DomainEvent';
import DateTime from '../../../../shared/core/objects/DateTime';
import type IdCheckList from '../objects/IdCheckList';
export default class CheckListDeleted extends DomainEvent {
    constructor(key: string, date: DateTime, actor: IdEntity, ownerId: IdEntity, idCheckList: IdCheckList);
}
//# sourceMappingURL=CheckListDeleted.d.ts.map