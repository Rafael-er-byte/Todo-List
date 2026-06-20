import ValueObject from "../../../shared/core/objects/ValueObject";
export default class TaskList extends ValueObject {
    constructor(id, position, project) {
        super();
        this.id = id;
        this.position = position;
        this.project = project;
    }
}
//# sourceMappingURL=TaskList.js.map