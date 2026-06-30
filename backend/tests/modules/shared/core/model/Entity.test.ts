import { describe, it, expect } from 'vitest';
import Entity from "../../../../../src/modules/shared/core/model/Entity";
import IdEntity from "../../../../../src/modules/shared/core/objects/IdEntity";
import ID from "../../../../../src/modules/shared/core/objects/ID";
import DateTime from "../../../../../src/modules/shared/core/objects/DateTime";
import DomainEvent from "../../../../../src/modules/shared/core/events/DomainEvent";

describe('Entity abstract class', () => {

    class TestEntity extends Entity {
        constructor(idEntity: IdEntity) {
            super(idEntity);
        }

        addEvent(event: DomainEvent): void {
            super.addEvent(event);
        }

        toPrimitives(): unknown {
            return { idEntity: super.getID().getID() };
        }
    }

    function createTestEntity(): TestEntity {
        const idEntity = new IdEntity(ID.generateId().toString());
        return new TestEntity(idEntity);
    }

    function createDomainEvent(): DomainEvent {
        return new DomainEvent(
            ID.generateId().toString(),
            DateTime.now(),
            new IdEntity(ID.generateId().toString()),
            new IdEntity(ID.generateId().toString()),
            new IdEntity(ID.generateId().toString()),
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

    it("should update lastUpdate when adding an event", () => {
        const entity = createTestEntity();
        const event = createDomainEvent();

        entity.addEvent(event);
        expect(entity.getLastUpdate()).toBe(event.getDate());
    });
});
