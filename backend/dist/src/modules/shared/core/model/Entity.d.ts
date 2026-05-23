import type DomainEvent from '../events/DomainEvent';
import DateTime from '../objects/DateTime';
import DeletedAt from '../objects/DeletedAt';
import type IdEntity from '../objects/IdEntity';
import None from '../objects/None';
import Version from '../objects/Version';
export default abstract class Entity {
    private tmpHistory;
    private lastUpdate;
    private version;
    private deletedAt;
    private owner;
    private readonly idEntity;
    protected constructor(idEntity: IdEntity, owner: IdEntity | None);
    protected addEvent(event: DomainEvent): void;
    protected create(): void;
    protected build(version: Version, deletedAt: DeletedAt): void;
    protected softDelete(): void;
    protected changeOwner(newOwner: IdEntity | None): void;
    pullEvents(): DomainEvent[];
    ownership(child: Entity): boolean;
    getLastUpdate(): DateTime;
    getVersion(): Version;
    getDeletedAt(): DeletedAt;
    exists(): boolean;
    getID(): IdEntity;
    getOwner(): IdEntity | None;
    abstract toPrimitives(): unknown;
}
//# sourceMappingURL=Entity.d.ts.map