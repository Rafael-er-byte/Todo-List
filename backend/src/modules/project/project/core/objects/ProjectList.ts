import type IdEntity from "../../../../shared/core/objects/IdEntity";
import type PositiveInteger from "../../../../shared/core/objects/PositiveInteger";
import ValueObject from "../../../../shared/core/objects/ValueObject";

export default class ProjectList extends ValueObject{
    constructor(public idList: IdEntity, public position: PositiveInteger){
        super();
    }
}
