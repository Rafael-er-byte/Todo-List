import Version from "../../../../../src/modules/shared/core/objects/Version";
import DeletedAt from "../../../../../src/modules/shared/core/objects/DeletedAt";
import Entity from "../../../../../src/modules/shared/core/model/Entity";
import IdEntity from "../../../../../src/modules/shared/core/objects/IdEntity";
import type EntityPrimitives from "../../../../../src/modules/shared/core/model/contracts/EntityPrimitives";
import None from "../../../../../src/modules/shared/core/objects/None";
import ID from "../../../../../src/modules/shared/core/objects/ID";
import DateTime from "../../../../../src/modules/shared/core/objects/DateTime";
import ProjectInfo from "../../../../../src/modules/shared/core/events/ProjectInfo";
import DomainEvent from "../../../../../src/modules/shared/core/events/DomainEvent";
import ResourceNotFound from "../../../../../src/modules/shared/core/errors/ResourceNotFound";

describe('Entity abstract class', () => {
    class testEntity extends Entity{
        constructor(version: Version, deletedAt: DeletedAt, idEntity: IdEntity){
            super(version, deletedAt, idEntity);
        }

        addEvent(event: DomainEvent): void{
            console.log("Adding event: ", event);
            super.addEvent(event);
        }

        toPrimitives(): EntityPrimitives{
            return this.entityPrimitives();
        }
    }

    function createTestEntity(): testEntity {
        const version = new Version(1);
        const deletedAt = new DeletedAt(new None());
        const idEntity = new IdEntity(ID.generateId().getId());
        return new testEntity(version, deletedAt, idEntity);
    }

    function createDomainEvent(): DomainEvent {
        const projectInfo = new ProjectInfo(ID.generateId().getId(), "ProjectExample");
        return new DomainEvent
                    (
                        ID.generateId(), 
                        DateTime.now(), 
                        {name: "testActor", id: "actorId"}, 
                        projectInfo, new IdEntity(ID.generateId().getId()), 
                        "TEST_EVENT"
                    );
    }

    it('should create an instance of a class that extends Entity', () => {
        const entity = createTestEntity();
        expect(entity).toBeInstanceOf(testEntity);
    });

    it('should add an event and pull it', () => {
        const entity = createTestEntity();
        const event = createDomainEvent();
        entity.addEvent(event);

        const events = entity.pullEvents();
        expect(events).toContain(event);
    });

    it("Should generate new version and update lastUpdate when adding an event", () => {
        const entity = createTestEntity();
        const event = createDomainEvent();

        const initialVersion = entity.getVersion().valueOf();
        const initialLastUpdate = entity.getLastUpdate();

        entity.addEvent(event);
        
        expect(entity.getVersion().valueOf()).toBe(initialVersion + 1);
        expect(entity.getLastUpdate()).toBe(event.getDate());

    });

    it("Should mark the entity as deleted", () => {
        const entity = createTestEntity();
        expect(entity.exists()).toBe(true);

        entity.delete();
        expect(entity.exists()).toBe(false);
        expect(entity.getDeletedAt().exists()).toBe(false);
    });

    it("Should not allow adding events to a deleted entity", () => {
        const entity = createTestEntity();
        entity.delete();
        const event = createDomainEvent();

        expect(() => entity.addEvent(event)).toThrow(ResourceNotFound);   
    });

    it("Should create a deleted instance of the entity", () => {
        const version = new Version(1);
        const deletedAt = DeletedAt.delete();
        const idEntity = new IdEntity(ID.generateId().getId());
        const entity = new testEntity(version, deletedAt, idEntity);    
        expect(entity.exists()).toBe(false);
    });

    it("Should return the correct primitives", () => {
        const entity = createTestEntity();
        const primitives = entity.toPrimitives();
        expect(primitives.idEntity).toBe(entity.getID().getID());
        expect(primitives.version).toBe(entity.getVersion().valueOf());
        expect(primitives.deletedAt).toBeNull();
    });

    it("Should return the correct primitives for a deleted entity", () => {
        const version = new Version(1);
        const deletedAt = DeletedAt.delete();
        const idEntity = new IdEntity(ID.generateId().getId());
        const entity = new testEntity(version, deletedAt, idEntity);    
        const primitives = entity.toPrimitives();
        expect(primitives.idEntity).toBe(entity.getID().getID());
        expect(primitives.version).toBe(entity.getVersion().valueOf());
        expect(primitives.deletedAt).toBeInstanceOf(Date);
        const deletedAtDateTime = deletedAt.getDeletedTime() as DateTime;
        expect(primitives.deletedAt).toEqual(deletedAtDateTime.getDate());
    });

    it("Should return the correct ID", () => {
        const entity = createTestEntity();
        expect(entity.getID().getID()).toBe(entity.toPrimitives().idEntity);
    });

    it("Should return the correct version", () => {
        const entity = createTestEntity();
        expect(entity.getVersion().valueOf()).toBe(entity.toPrimitives().version);
    });

    it("Should return the correct deletedAt", () => {
        const version = new Version(1);
        const deletedAt = DeletedAt.delete();
        const idEntity = new IdEntity(ID.generateId().getId());
        const entity = new testEntity(version, deletedAt, idEntity);    
        const primitives = entity.toPrimitives();
        expect(primitives.deletedAt).toBeInstanceOf(Date);
        const deletedAtDateTime = deletedAt.getDeletedTime() as DateTime;
        expect(primitives.deletedAt).toEqual(deletedAtDateTime.getDate());
    });
});        