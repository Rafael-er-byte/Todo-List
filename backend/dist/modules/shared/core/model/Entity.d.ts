import type DomainEvent from '../events/DomainEvent';
import DateTime from '../objects/DateTime';
import type IdEntity from '../objects/IdEntity';
export default abstract class Entity {
    private tmpHistory;
    private lastUpdate;
    private readonly idEntity;
    protected constructor(idEntity: IdEntity);
    protected addEvent(event: DomainEvent): void;
    pullEvents(): DomainEvent[];
    getLastUpdate(): DateTime;
    getID(): IdEntity;
    abstract toPrimitives(): unknown;
}
//# sourceMappingURL=Entity.d.ts.map