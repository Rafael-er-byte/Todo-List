import IdCategory from '../objects/IdCategory';
import DateTime from '../../../shared/core/objects/DateTime';
import CategoryName from '../objects/CategoryName';
import Entity from '../../../shared/core/model/Entity';
import CategoryColor from '../objects/CategoryColor';
import type { AllowedColors } from '../types/AllowedColors';
import CategoryCreated from '../events/CategoryCreated';
import type iCategoryParams from '../interfaces/CategoryParams';
import CategoryNameChanged from '../events/CategoryNameChanged';
import CategoryColorChanged from '../events/CategoryColorChanged';
import type Member from '../../../member/core/model/Member';
import IdProject from '../../../shared/core/objects/IdProject';
import DeletedAt from '../../../shared/core/objects/DeletedAt';
import Version from '../../../shared/core/objects/Version';
import InternalId from '../../../shared/core/objects/InternalId';
import type CategoryParams from '../interfaces/CategoryParams';

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
    idProject: string,
    version: number,
    deletedAt: Date | null,
    modifier: Member,
    projectName: string,
  ) {
    const idCategory = new IdCategory(id);
    const projectId = new IdProject(idProject);
    const categoryVersion = new Version(version);
    const categoryDeletedAt = deletedAt? DeletedAt.createDeleted(DateTime.create(deletedAt)) : DeletedAt.createActive();
    
    const category = new Category(
      new CategoryName(name),
      new CategoryColor(color as AllowedColors),
      projectId,
      categoryVersion,
      categoryDeletedAt,
      idCategory,
    );
    category.addEvent(new CategoryCreated(DateTime.now(), modifier, projectId, idCategory, projectName));
    return category;
  }

  public static fromPrimitives(params: CategoryParams) {
    return new Category(
        new CategoryName(params.name),
        new CategoryColor(params.color as AllowedColors),
        new IdProject(params.idProject),
        new Version(params.version),
        params.deletedAt ? DeletedAt.createDeleted(DateTime.create(params.deletedAt)) : DeletedAt.createActive(),
        new IdCategory(params.id),
        new InternalId(params.internalId),
      );
  }

  public updateName(name: CategoryName, modifier: Member, projectName: string): void {
    this.name = name;
    this.addEvent(
      new CategoryNameChanged(DateTime.now(), modifier, this.idProject, this.idCategory, name, projectName),
    );
  }

  public updateColor(color: CategoryColor, modifier: Member, projectName: string): void {
    this.color = color;
    this.addEvent(
      new CategoryColorChanged(DateTime.now(), modifier, this.idProject, this.idCategory, color, projectName),
    );
  }

  public getId(): string {
    return this.idCategory.getID();
  }

  public exists(): boolean {
    return this.isActive.exists();
  }

  public toPrimitives(): iCategoryParams {
    return {
      id: this.idCategory.getID(),
      idProject: this.idProject.getID(),
      name: this.name.getName(),
      color: this.color.getColor(),
      isActive: this.isActive.getStatus(),
    };
  }
}
