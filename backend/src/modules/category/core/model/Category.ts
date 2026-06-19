import IdCategory from '../objects/IdCategory';
import DateTime from '../../../shared/core/objects/DateTime';
import CategoryName from '../objects/CategoryName';
import Entity from '../../../shared/core/model/Entity';
import CategoryColor from '../objects/CategoryColor';
import CategoryCreated from '../events/CategoryCreated';
import CategoryNameChanged from '../events/CategoryNameChanged';
import CategoryColorChanged from '../events/CategoryColorChanged';
import DeletedAt from '../../../shared/core/objects/DeletedAt';
import type CategoryParams from '../interfaces/CategoryParams';
import IdEntity from '../../../shared/core/objects/IdEntity';
import CategoryDeleted from '../events/CategoryDeleted';
import type { AllowedColors } from '../../../shared/core/types/AllowedColors';

export default class Category extends Entity {
  private name!: CategoryName;
  private color!: CategoryColor;
  private idProject!: IdEntity;

  private constructor(
    name: CategoryName,
    color: CategoryColor,
    idProject: IdEntity,
    idEntity: IdCategory,
  ) {
    super(idEntity);
    this.name = name;
    this.color = color;
    this.idProject = idProject;
  }

  public static create(
    key: string,
    id: IdCategory,
    name: CategoryName,
    color: CategoryColor,
    actorId: IdEntity,
    projectID: IdEntity,
  ) {
    const category = new Category(
      name,
      color,
      projectID,
      id
    );

    category.create();
    category.addEvent(new CategoryCreated(key, DateTime.now(), actorId, projectID, id));
    return category;
  }

  public static fromPrimitives(params: CategoryParams) {
    const category = new Category(
        new CategoryName(params.name),
        new CategoryColor(params.color as AllowedColors),
        new IdEntity(params.idProject),
        new IdCategory(params.id),
      );

      category.build(
        DeletedAt.createFromPrimitive(params.deletedAt)
      );

      return category;
  }

  public updateName(key: string, name: CategoryName, actor: IdEntity): void {
    this.name = name;
    this.addEvent(
      new CategoryNameChanged(key, DateTime.now(), actor, this.getIdProject(), super.getID(), name)
    );
  }

  public updateColor(key: string, color: CategoryColor, actor: IdEntity): void {
    this.color = color;
    this.addEvent(
      new CategoryColorChanged(key, DateTime.now(), actor, this.getIdProject(), super.getID(), color),
    );
  }

  public delete(key: string, actor: IdEntity): void{
    super.addEvent(
      new CategoryDeleted(key, DateTime.now(), actor, this.getIdProject(), super.getID())
    );
    super.softDelete();
  }

  public getIdProject(): IdEntity {
    return this.idProject;
  }

  public toPrimitives(): CategoryParams {
    return {
      id: super.getID().getID(),
      idProject: this.getIdProject().getID(),
      name: this.name.getName(),
      color: this.color.getColor(),
      deletedAt: super.getDeletedAt().toPrimitive(),
    };
  }
}
