import type IdEntity from "../../../shared/core/objects/IdEntity";
import type PositiveInteger from "../../../shared/core/objects/PositiveInteger";
import ValueObject from "../../../shared/core/objects/ValueObject";
export default class TaskList extends ValueObject {
    id: IdEntity;
    position: PositiveInteger;
    project: IdEntity;
    constructor(id: IdEntity, position: PositiveInteger, project: IdEntity);
}
//# sourceMappingURL=TaskList.d.ts.map