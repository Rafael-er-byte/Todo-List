import IdCategory from '../objects/IdCategory';
import DateTime from '../../../../shared/core/objects/DateTime';
import CategoryName from '../objects/CategoryName';
import Entity from '../../../../shared/core/model/Entity';
import CategoryColor from '../objects/CategoryColor';
import CategoryCreated from '../events/CategoryCreated';
import CategoryNameChanged from '../events/CategoryNameChanged';
import CategoryColorChanged from '../events/CategoryColorChanged';
import IdEntity from '../../../../shared/core/objects/IdEntity';
import CategoryDeleted from '../events/CategoryDeleted';
export default class Category extends Entity {
    constructor(name, color, idProject, idEntity) {
        super(idEntity);
        this.name = name;
        this.color = color;
        this.idProject = idProject;
    }
    static create(params) {
        const id = new IdCategory(params.id);
        const name = new CategoryName(params.name);
        const color = new CategoryColor(params.color);
        const projectID = new IdEntity(params.idProject);
        const actorId = new IdEntity(params.actorId);
        const category = new Category(name, color, projectID, id);
        category.addEvent(new CategoryCreated(params.key, DateTime.now(), actorId, projectID, id));
        return category;
    }
    static fromPrimitives(params) {
        const category = new Category(new CategoryName(params.name), new CategoryColor(params.color), new IdEntity(params.idProject), new IdCategory(params.id));
        return category;
    }
    updateName(key, name, actor) {
        this.name = name;
        this.addEvent(new CategoryNameChanged(key, DateTime.now(), actor, this.getIdProject(), super.getID(), name));
    }
    updateColor(key, color, actor) {
        this.color = color;
        this.addEvent(new CategoryColorChanged(key, DateTime.now(), actor, this.getIdProject(), super.getID(), color));
    }
    delete(key, actor) {
        super.addEvent(new CategoryDeleted(key, DateTime.now(), actor, this.getIdProject(), super.getID()));
    }
    getIdProject() {
        return this.idProject;
    }
    toPrimitives() {
        return {
            id: super.getID().toString(),
            idProject: this.getIdProject().toString(),
            name: this.name.getName(),
            color: this.color.getColor(),
        };
    }
}
//# sourceMappingURL=Category.js.map