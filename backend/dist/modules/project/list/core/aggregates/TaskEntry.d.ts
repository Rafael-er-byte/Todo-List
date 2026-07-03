import type IdEntity from "../../../../shared/core/objects/IdEntity";
import type PositiveInteger from "../../../../shared/core/objects/PositiveInteger";
export default class TaskEntry {
    id: IdEntity;
    position: PositiveInteger;
    project: IdEntity;
    archivedByList: boolean;
}
//# sourceMappingURL=TaskEntry.d.ts.map