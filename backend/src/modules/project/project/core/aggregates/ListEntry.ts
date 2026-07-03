import type IdEntity from "../../../../shared/core/objects/IdEntity";
import type PositiveInteger from "../../../../shared/core/objects/PositiveInteger";

export default class ListEntry{
    public idList!: IdEntity;
    public position!: PositiveInteger
    public isArchived!: boolean;
}
