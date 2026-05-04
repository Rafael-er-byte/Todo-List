import Version from "../../../../../src/modules/shared/core/objects/Version";
import DeletedAt from "../../../../../src/modules/shared/core/objects/DeletedAt";
import Entity from "../../../../../src/modules/shared/core/model/Entity";
import IdEntity from "../../../../../src/modules/shared/core/objects/IdEntity";
import type EntityPrimitives from "../../../../../src/modules/shared/core/model/contracts/EntityPrimitives";
import ID from "../../../../../src/modules/shared/core/objects/ID";
import DateTime from "../../../../../src/modules/shared/core/objects/DateTime";
import DomainEvent from "../../../../../src/modules/shared/core/events/DomainEvent";
import ResourceNotFound from "../../../../../src/modules/shared/core/errors/ResourceNotFound";
import InternalId from "../../../../../src/modules/shared/core/objects/InternalId";

describe('Entity abstract class', () => {

    class TestEntity extends Entity {
        constructor(idEntity: IdEntity, internalId?: InternalId) {
            super(idEntity, internalId);
        }

        static create(idEntity: IdEntity, internalId?: InternalId): TestEntity {
            const instance = new TestEntity(idEntity, internalId);
            instance.create();
            return instance;
        }

        static fromPrimitives(
            version: Version,
            deletedAt: DeletedAt,
            idEntity: IdEntity,
            internalId?: InternalId
        ): TestEntity {
            const instance = new TestEntity(idEntity, internalId);
            instance.build(version, deletedAt);
            return instance;
        }

        addEvent(event: DomainEvent): void {
            super.addEvent(event);
        }

        pullEvents(): DomainEvent[] {
            return super.pullEvents();
        }

        getLastUpdate(): DateTime {
            return super.getLastUpdate();
        }

        getVersion(): Version {
            return super.getVersion();
        }

        getDeletedAt(): DeletedAt {
            return super.getDeletedAt();
        }

        exists(): boolean {
            return super.exists();
        }

        delete(): void {
            super.softDelete();
        }

        getID(): IdEntity {
            return super.getID();
        }

        getInternalId(): InternalId | undefined {
            return super.getInternalId();
        }

        toPrimitives(): EntityPrimitives {
            return this.entityPrimitives();
        }
    }

    function createTestEntity(): TestEntity {
        const idEntity = new IdEntity(ID.generateId().getId());
        const internalId = new InternalId(12);
        return TestEntity.create(idEntity, internalId);
    }

    function createDomainEvent(): DomainEvent {
        const projectInfo = new IdEntity(ID.generateId().getId());

        return new DomainEvent(
            ID.generateId(),
            DateTime.now(),
            new IdEntity(ID.generateId().getId()),
            projectInfo,
            new IdEntity(ID.generateId().getId()),
            "TEST_EVENT"
        );
    }

    it('should create an instance of a class that extends Entity', () => {
        const entity = createTestEntity();
        expect(entity).toBeInstanceOf(TestEntity);
    });

    it('should add an event and pull it', () => {
        const entity = createTestEntity();
        const event = createDomainEvent();

        entity.addEvent(event);

        const events = entity.pullEvents();
        expect(events).toContain(event);
    });

    it("should increase version and update lastUpdate when adding an event", () => {
        const entity = createTestEntity();
        const event = createDomainEvent();

        const initialVersion = entity.getVersion().valueOf();
        expect(initialVersion).toEqual(0);
        entity.addEvent(event);
        expect(entity.getVersion().valueOf()).toEqual(1);
        expect(entity.getVersion().valueOf()).toBe(initialVersion + 1);
        expect(entity.getLastUpdate()).toBe(event.getDate());
    });

    it("should mark the entity as deleted", () => {
        const entity = createTestEntity();

        entity.delete();

        expect(entity.exists()).toBe(false);
        expect(entity.getDeletedAt().exists()).toBe(false);
    });

    it("should not allow adding events to a deleted entity", () => {
        const entity = createTestEntity();
        entity.delete();

        const event = createDomainEvent();

        expect(() => entity.addEvent(event)).toThrow(ResourceNotFound);
    });

    it("should create a deleted instance from primitives", () => {
        const idEntity = new IdEntity(ID.generateId().getId());
        const deletedAt = DeletedAt.delete();

        const entity = TestEntity.fromPrimitives(
            new Version(1),
            deletedAt,
            idEntity,
            new InternalId(12)
        );

        expect(entity.exists()).toBe(false);
    });

    it("should delete an active entity", () => {
        const entity = createTestEntity();

        entity.delete();

        expect(entity.exists()).toBe(false);
    });

    it("should return correct primitives for active entity", () => {
        const entity = createTestEntity();
        const primitives = entity.toPrimitives();

        expect(primitives.idEntity).toBe(entity.getID().getID());
        expect(primitives.version).toBe(entity.getVersion().valueOf());
        expect(primitives.deletedAt).toBeNull();
    });

    it("should return correct primitives for deleted entity", () => {
        const entity = createTestEntity();
        entity.delete();

        const primitives = entity.toPrimitives();

        expect(primitives.deletedAt).toBeInstanceOf(Date);
    });

    it("should reconstruct entity from primitives", () => {
        const entity = createTestEntity();
        entity.delete();

        const primitives = entity.toPrimitives();

        const reconstructed = TestEntity.fromPrimitives(
            new Version(primitives.version),
            primitives.deletedAt
                ? DeletedAt.createDeleted(DateTime.now())
                : DeletedAt.createActive(),
            new IdEntity(primitives.idEntity)
        );

        expect(reconstructed.getID().getID()).toBe(primitives.idEntity);
        expect(reconstructed.getVersion().valueOf()).toBe(primitives.version);
    });

    it("should return undefined for internalId if not provided", () => {
        const idEntity = new IdEntity(ID.generateId().getId());
        const entity = TestEntity.create(idEntity);

        expect(entity.getInternalId()).toBeUndefined();
    });

});