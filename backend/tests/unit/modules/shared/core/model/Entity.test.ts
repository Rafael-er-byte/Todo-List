import { describe, it, expect } from 'vitest';
import Entity from "../../../../../../src/modules/shared/core/model/Entity";
import IdEntity from "../../../../../../src/modules/shared/core/objects/IdEntity";
import ID from "../../../../../../src/modules/shared/core/objects/ID";

describe('Entity class', () => {

    class TestEntity extends Entity {
        constructor(idEntity: IdEntity) {
            super(idEntity);
        }

        toPrimitives(): unknown {
            return { idEntity: super.getId().toString() };
        }
    }

    function createTestEntity(): TestEntity {
        const idEntity = new IdEntity(ID.generateId().toString());
        return new TestEntity(idEntity);
    }

    it('should create an instance of a class that extends Entity', () => {
        const entity = createTestEntity();
        expect(entity).toBeInstanceOf(TestEntity);
    });

    it('should expose the id through getId', () => {
        const entity = createTestEntity();
        expect(entity.getId()).toBeInstanceOf(IdEntity);
    });

    it('should serialize id through toPrimitives', () => {
        const entity = createTestEntity();
        expect(entity.toPrimitives()).toEqual({ idEntity: entity.getId().toString() });
    });
});
