import type DomainEvent from '../events/DomainEvent';
import DateTime from '../objects/DateTime';
import DeletedAt from '../objects/DeletedAt';
import type IdEntity from '../objects/IdEntity';
export default abstract class Entity {
    private tmpHistory;
    private lastUpdate;
    private deletedAt;
    private readonly idEntity;
    protected constructor(idEntity: IdEntity);
    protected addEvent(event: DomainEvent): void;
    protected create(): void;
    protected build(deletedAt: DeletedAt): void;
    protected softDelete(): void;
    pullEvents(): DomainEvent[];
    getLastUpdate(): DateTime;
    getDeletedAt(): DeletedAt;
    exists(): boolean;
    getID(): IdEntity;
    abstract toPrimitives(): unknown;
}
//# sourceMappingURL=Entity.d.ts.map