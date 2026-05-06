import IdCategory from '../objects/IdCategory';
import DateTime from '../../../shared/core/objects/DateTime';
import CategoryName from '../objects/CategoryName';
import Entity from '../../../shared/core/model/Entity';
import CategoryColor from '../objects/CategoryColor';
import CategoryCreated from '../events/CategoryCreated';
import CategoryNameChanged from '../events/CategoryNameChanged';
import CategoryColorChanged from '../events/CategoryColorChanged';
import IdProject from '../../../shared/core/objects/IdProject';
import DeletedAt from '../../../shared/core/objects/DeletedAt';
import Version from '../../../shared/core/objects/Version';
import InternalId from '../../../shared/core/objects/InternalId';
import type CategoryParams from '../interfaces/CategoryParams';
import IdEntity from '../../../shared/core/objects/IdEntity';
import type DomainEvent from '../../../shared/core/events/DomainEvent';
import None from '../../../shared/core/objects/None';
import CategoryDeleted from '../events/CategoryDeleted';
import type { AllowedColors } from '../types/AllowedColors';
import isNone from '../../../shared/helpers/isNone';

export default class Category extends Entity {
  private name!: CategoryName;
  private color!: CategoryColor;
  private readonly idProject!: IdProject;

  private constructor(
    name: CategoryName,
    color: CategoryColor,
    idProject: IdProject,
    idEntity: IdCategory,
    internalId: InternalId | None,
  ) {
    super(idEntity, internalId);
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
    projectID: IdProject,
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
        new IdProject(params.idProject),
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
      new CategoryNameChanged(key, DateTime.now(), actor, this.idProject, super.getID(), name)
    );
  }

  public updateColor(key: string, color: CategoryColor, actor: IdEntity): void {
    this.color = color;
    this.addEvent(
      new CategoryColorChanged(key, DateTime.now(), actor, this.idProject, super.getID(), color),
    );
  }

  public getId(): IdCategory {
    return super.getID();
  }

  public exists(): boolean {
    return super.exists();
  }

  public getVersion(): Version {
    return super.getVersion();
  }

  public getDeletedTime(): DateTime | None {
    return super.getDeletedAt().getDeletedTime();
  }

  public getLastUpdate(): DateTime {
    return super.getLastUpdate();
  }

  public pullEvents(): DomainEvent[]{
    return super.pullEvents();
  }

  public delete(key: string, actor: IdEntity): void{
    super.addEvent(
      new CategoryDeleted(key, DateTime.now(), actor, this.idProject, super.getID())
    );
    super.softDelete();
  }

  public toPrimitives(): CategoryParams {
    return {
      id: super.getID().getID(),
      idProject: this.idProject.getID(),
      name: this.name.getName(),
      color: this.color.getColor(),
      version: super.getVersion().valueOf(),
      deletedAt: super.getDeletedAt().toPrimitive(),
      internalId: isNone(super.getInternalId()) ? null : (super.getInternalId() as InternalId).getId()
    };
  }
}
