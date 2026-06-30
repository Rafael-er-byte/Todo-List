import type IdEntity from "../../../../shared/core/objects/IdEntity";
import type PositiveInteger from "../../../../shared/core/objects/PositiveInteger";
import ValueObject from "../../../../shared/core/objects/ValueObject";

export default class TaskList extends ValueObject{
    constructor(public id: IdEntity, public position: PositiveInteger, public project: IdEntity){
        super();
    }
}
