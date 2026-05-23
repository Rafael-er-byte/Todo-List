import IdCategory from '../objects/IdCategory';
import DateTime from '../../../shared/core/objects/DateTime';
import CategoryName from '../objects/CategoryName';
import Entity from '../../../shared/core/model/Entity';
import CategoryColor from '../objects/CategoryColor';
import CategoryCreated from '../events/CategoryCreated';
import CategoryNameChanged from '../events/CategoryNameChanged';
import CategoryColorChanged from '../events/CategoryColorChanged';
import DeletedAt from '../../../shared/core/objects/DeletedAt';
import Version from '../../../shared/core/objects/Version';
import IdEntity from '../../../shared/core/objects/IdEntity';
import CategoryDeleted from '../events/CategoryDeleted';
export default class Category extends Entity {
    constructor(name, color, idProject, idEntity) {
        super(idEntity, idProject);
        this.name = name;
        this.color = color;
    }
    static create(key, id, name, color, actorId, projectID) {
        const category = new Category(name, color, projectID, id);
        category.create();
        category.addEvent(new CategoryCreated(key, DateTime.now(), actorId, projectID, id));
        return category;
    }
    static fromPrimitives(params) {
        const category = new Category(new CategoryName(params.name), new CategoryColor(params.color), new IdEntity(params.idProject), new IdCategory(params.id));
        category.build(new Version(params.version), DeletedAt.createFromPrimitive(params.deletedAt));
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
        super.softDelete();
    }
    getIdProject() {
        return super.getOwner();
    }
    toPrimitives() {
        return {
            id: super.getID().getID(),
            idProject: this.getIdProject().getID(),
            name: this.name.getName(),
            color: this.color.getColor(),
            version: super.getVersion().valueOf(),
            deletedAt: super.getDeletedAt().toPrimitive(),
        };
    }
}
//# sourceMappingURL=Category.js.map