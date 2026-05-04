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
import type None from '../../../shared/core/objects/None';
import CategoryDeleted from '../events/CategoryDeleted';
import type { AllowedColors } from '../types/AllowedColors';

export default class Category extends Entity {
  private name!: CategoryName;
  private color!: CategoryColor;
  private readonly idProject!: IdProject;

  private constructor(
    name: CategoryName,
    color: CategoryColor,
    idProject: IdProject,
    version: Version,
    deletedAt: DeletedAt,
    idEntity: IdCategory,
    internalId?: InternalId,
  ) {
    super(version, deletedAt, idEntity, internalId);

    this.name = name;
    this.color = color;
    this.idProject = idProject;
  }

  public static create(
    id: string,
    name: string,
    color: string,
    version: number,
    deletedAt: Date | null,
    actorId: string,
    projectID: string,
  ) {
    const idCategory = new IdCategory(id);
    const projectId = new IdEntity(projectID);
    const categoryVersion = new Version(version);
    const actor = new IdEntity(actorId);
    const categoryDeletedAt = deletedAt? DeletedAt.createDeleted(DateTime.create(deletedAt)) : DeletedAt.createActive();
    
    const category = new Category(
      new CategoryName(name),
      new CategoryColor(color as AllowedColors),
      projectId,
      categoryVersion,
      categoryDeletedAt,
      idCategory,
    );
    category.addEvent(new CategoryCreated(DateTime.now(), actor, projectId, idCategory));
    return category;
  }

  public static fromPrimitives(params: CategoryParams) {
    return new Category(
        new CategoryName(params.name),
        new CategoryColor(params.color as AllowedColors),
        new IdProject(params.idProject),
        new Version(params.version),
        params.deletedAt ? DeletedAt.createDeleted(DateTime.create(params.deletedAt as Date)) : DeletedAt.createActive(),
        new IdCategory(params.id),
        new InternalId(params.internalId as number),
      );
  }

  public updateName(name: CategoryName, actor: IdEntity): void {
    this.name = name;
    this.addEvent(
      new CategoryNameChanged(DateTime.now(), actor, this.idProject, super.getID(), name)
    );
  }

  public updateColor(color: CategoryColor, actor: IdEntity): void {
    this.color = color;
    this.addEvent(
      new CategoryColorChanged(DateTime.now(), actor, this.idProject, super.getID(), color),
    );
  }

  public getId(): string {
    return super.getID().getID();
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

  public delete(actor: IdEntity): void{
    super.addEvent(
      new CategoryDeleted(DateTime.now(), actor, this.idProject, super.getID())
    );
    super.softDelete();
  }

  public toPrimitives(): CategoryParams {
    const deletedTime = super.exists()? undefined: super.getDeletedAt().getDeletedTime() as DateTime;

    return {
      id: super.getID().getID(),
      idProject: this.idProject.getID(),
      name: this.name.getName(),
      color: this.color.getColor(),
      version: super.getVersion().valueOf(),
      deletedAt: deletedTime? deletedTime.getDate() as Date: undefined,
      internalId: super.getInternalId()?.getId()
    };
  }
}
