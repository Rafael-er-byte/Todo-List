import DomainEvent from '../../../shared/core/events/DomainEvent';
import type DateTime from '../../../shared/core/objects/DateTime';
import type IdEntity from '../../../shared/core/objects/IdEntity';
import type AccountParams from '../interfaces/AccountParams';
export default class AccountCreated extends DomainEvent {
    constructor(key: string, date: DateTime, actor: IdEntity, ownerId: IdEntity, idEntity: IdEntity, params: AccountParams);
}
//# sourceMappingURL=AccountCreated.d.ts.map