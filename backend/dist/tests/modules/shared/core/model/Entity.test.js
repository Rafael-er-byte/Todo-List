import { describe, it, expect } from 'vitest';
import DeletedAt from "../../../../../src/modules/shared/core/objects/DeletedAt";
import Entity from "../../../../../src/modules/shared/core/model/Entity";
import IdEntity from "../../../../../src/modules/shared/core/objects/IdEntity";
import ID from "../../../../../src/modules/shared/core/objects/ID";
import DateTime from "../../../../../src/modules/shared/core/objects/DateTime";
import DomainEvent from "../../../../../src/modules/shared/core/events/DomainEvent";
import ResourceNotFound from "../../../../../src/modules/shared/core/errors/ResourceNotFound";
describe('Entity abstract class', () => {
    class TestEntity extends Entity {
        constructor(idEntity) {
            super(idEntity);
        }
        static create(idEntity) {
            const instance = new TestEntity(idEntity);
            instance.create();
            return instance;
        }
        static fromPrimitives(params) {
            const instance = new TestEntity(new IdEntity(params.idEntity));
            instance.build(params.deletedAt ? DeletedAt.createDeleted(DateTime.create(params.deletedAt)) : DeletedAt.createActive());
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
                deletedAt: super.getDeletedAt().exists() ? null : super.getDeletedAt().getDeletedTime().getDate()
            };
        }
    }
    class OwnerEntity extends Entity {
        constructor(idEntity) {
            super(idEntity);
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
    function createTestEntity() {
        const idEntity = new IdEntity(ID.generateId().getId());
        return TestEntity.create(idEntity);
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
    it("should update lastUpdate when adding an event", () => {
        const entity = createTestEntity();
        const event = createDomainEvent();
        entity.addEvent(event);
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
            deletedAt: deletedAt.getDeletedTime().getDate()
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
            deletedAt: primitives.deletedAt
        });
        expect(reconstructed.getID().getID()).toBe(primitives.idEntity);
    });
});
//# sourceMappingURL=Entity.test.js.map