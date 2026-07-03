import type IdEntity from "../../../../shared/core/objects/IdEntity";
import type PositiveInteger from "../../../../shared/core/objects/PositiveInteger";

export default class TaskEntry {
    public id!: IdEntity; 
    public position!: PositiveInteger; 
    public project!: IdEntity; 
    public archivedByList!: boolean; 
}
