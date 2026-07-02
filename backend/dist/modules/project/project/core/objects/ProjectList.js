import ValueObject from "../../../../shared/core/objects/ValueObject";
export default class ProjectList extends ValueObject {
    constructor(idList, position) {
        super();
        this.idList = idList;
        this.position = position;
    }
}
//# sourceMappingURL=ProjectList.js.map