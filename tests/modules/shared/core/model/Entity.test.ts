import type Version from "../../../../../src/modules/shared/core/objects/Version";
import type DeletedAt from "../../../../../src/modules/shared/core/objects/DeletedAt";
import Entity from "../../../../../src/modules/shared/core/model/Entity";

describe('Entity abstract class', () => {
    class testEntity extends Entity{
        constructor(version: Version, deletedAt: DeletedAt){
            super(version, deletedAt);
        }

        toPrimitives(): {

        }
    }
  
    it('should create an instance of a class that extends Entity', () => {
    class TestEntity extends Entity {
    }
  });

});        