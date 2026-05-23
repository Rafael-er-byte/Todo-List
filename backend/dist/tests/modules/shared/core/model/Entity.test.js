import { describe, it, expect } from 'vitest';
import Version from "../../../../../src/modules/shared/core/objects/Version";
import DeletedAt from "../../../../../src/modules/shared/core/objects/DeletedAt";
import Entity from "../../../../../src/modules/shared/core/model/Entity";
import IdEntity from "../../../../../src/modules/shared/core/objects/IdEntity";
import ID from "../../../../../src/modules/shared/core/objects/ID";
import DateTime from "../../../../../src/modules/shared/core/objects/DateTime";
import DomainEvent from "../../../../../src/modules/shared/core/events/DomainEvent";
import ResourceNotFound from "../../../../../src/modules/shared/core/errors/ResourceNotFound";
import Unauthorized from "../../../../../src/modules/shared/core/errors/Unauthorized";
import None from "../../../../../src/modules/shared/core/objects/None";
import isNone from "../../../../../src/modules/shared/helpers/isNone";
describe('Entity abstract class', () => {
    class TestEntity extends Entity {
        constructor(idEntity, owner) {
            super(idEntity, owner);
        }
        static create(idEntity, owner = new None()) {
            const instance = new TestEntity(idEntity, owner);
            instance.create();
            return instance;
        }
        static fromPrimitives(params) {
            const owner = params.owner ? new IdEntity(params.owner) : new None();
            const instance = new TestEntity(new IdEntity(params.idEntity), owner);
            instance.build(new Version(params.version), params.deletedAt ? DeletedAt.createDeleted(DateTime.create(params.deletedAt)) : DeletedAt.createActive());
            return instance;
        }
        addEvent(event) {
            super.addEvent(event);
        }
        delete() {
            super.softDelete();
        }
        toPrimitives() {
            return {
                idEntity: super.getID().getID(),
                version: super.getVersion().valueOf(),
                deletedAt: super.getDeletedAt().exists() ? null : super.getDeletedAt().getDeletedTime().getDate(),
                owner: isNone(super.getOwner()) ? null : super.getOwner().getID()
            };
        }
    }
    class OwnerEntity extends Entity {
        constructor(idEntity) {
            super(idEntity, new None());
        }
        static create(idEntity) {
            const instance = new OwnerEntity(idEntity);
            instance.create();
            return instance;
        }
        toPrimitives() {
            return { idEntity: super.getID().getID() };
        }
    }
    function createTestEntity(owner = new None()) {
        const idEntity = new IdEntity(ID.generateId().getId());
        return TestEntity.create(idEntity, owner);
    }
    function createOwnerEntity() {
        return OwnerEntity.create(new IdEntity(ID.generateId().getId()));
    }
    function createDomainEvent() {
        return new DomainEvent(ID.generateId().getId(), DateTime.now(), new IdEntity(ID.generateId().getId()), new IdEntity(ID.generateId().getId()), new IdEntity(ID.generateId().getId()), "TEST_EVENT");
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
        const entity = TestEntity.fromPrimitives({
            idEntity: idEntity.getID(),
            version: 5,
            deletedAt: deletedAt.getDeletedTime().getDate(),
            owner: null
        });
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
        const reconstructed = TestEntity.fromPrimitives({
            idEntity: primitives.idEntity,
            version: primitives.version,
            deletedAt: primitives.deletedAt,
            owner: primitives.owner
        });
        expect(reconstructed.getID().getID()).toBe(primitives.idEntity);
        expect(reconstructed.getVersion().valueOf()).toBe(primitives.version);
    });
    // ─── Ownership tests ──────────────────────────────────────────────────────
    it("should confirm ownership when the child belongs to the owner", () => {
        const owner = createOwnerEntity();
        const child = createTestEntity(owner.getID());
        expect(() => owner.ownership(child)).not.toThrow();
        expect(owner.ownership(child)).toBe(true);
    });
    it("should throw Unauthorized when a child has no owner and ownership is checked", () => {
        const owner = createOwnerEntity();
        const orphan = createTestEntity();
        expect(() => owner.ownership(orphan)).toThrow(Unauthorized);
    });
    it("should throw Unauthorized when the child belongs to a different owner", () => {
        const realOwner = createOwnerEntity();
        const impostor = createOwnerEntity();
        const child = createTestEntity(realOwner.getID());
        expect(() => impostor.ownership(child)).toThrow(Unauthorized);
    });
});
//# sourceMappingURL=Entity.test.js.map