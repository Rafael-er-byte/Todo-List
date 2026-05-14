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
import InternalId from '../../../shared/core/objects/InternalId';
import type CategoryParams from '../interfaces/CategoryParams';
import IdEntity from '../../../shared/core/objects/IdEntity';
import None from '../../../shared/core/objects/None';
import CategoryDeleted from '../events/CategoryDeleted';
import type { AllowedColors } from '../types/AllowedColors';
import internalIdToPrimitive from '../../../shared/helpers/InternalIdToPrimitive';

export default class Category extends Entity {
  private name!: CategoryName;
  private color!: CategoryColor;

  private constructor(
    name: CategoryName,
    color: CategoryColor,
    idProject: IdEntity,
    idEntity: IdCategory,
    internalId: InternalId | None,
  ) {
    super(idEntity, internalId, idProject);
    this.name = name;
    this.color = color;
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
      id,
      new None()
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
        new InternalId(params.internalId as number),
      );

      category.build(
        new Version(params.version), 
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
    return super.getOwner() as IdEntity;
  }

  public toPrimitives(): CategoryParams {
    return {
      id: super.getID().getID(),
      idProject: this.getIdProject().getID(),
      name: this.name.getName(),
      color: this.color.getColor(),
      version: super.getVersion().valueOf(),
      deletedAt: super.getDeletedAt().toPrimitive(),
      internalId: internalIdToPrimitive(super.getInternalId()),
    };
  }
}
