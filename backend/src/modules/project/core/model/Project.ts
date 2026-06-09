import List from '../../../list/core/model/List';
import Entity from '../../../shared/core/model/Entity';
import DateTime from '../../../shared/core/objects/DateTime';
import DeletedAt from '../../../shared/core/objects/DeletedAt';
import IdEntity from '../../../shared/core/objects/IdEntity';
import None from '../../../shared/core/objects/None';
import Version from '../../../shared/core/objects/Version';
import Attachment from '../../../shared/core/objects/Attachment';
import IntNumber from '../../../shared/core/objects/IntNumber';
import Text from '../../../shared/core/objects/Text';
import Url from '../../../shared/core/objects/URL';
import InvalidOperation from '../../../shared/core/errors/InvalidOperation';
import ProjectAddMemberSettingsUpdated from '../events/ProjectAddMemberSettingsUpdated';
import ProjectBackgroundImageUpdated from '../events/ProjectBackgroundImageUpdated';
import ProjectClosed from '../events/ProjectClosed';
import ProjectColorUpdated from '../events/ProjectColorUpdated';
import ProjectCommentImmutableSetupTo from '../events/ProjectCommentImmutableSetupTo';
import ProjectCommentSettingsUpdated from '../events/ProjectCommentSettingsUpdated';
import ProjectCompletedTasksVisibilityUpdated from '../events/ProjectCompletedTasksVisibilityUpdated';
import ProjectCreateResourceSettingUpdated from '../events/ProjectCreateResourceSettingUpdated';
import ProjectCreated from '../events/ProjectCreated';
import ProjectDeleted from '../events/ProjectDeleted';
import ProjectDescriptionUpdated from '../events/ProjectDescriptionUpdated';
import ProjectNameUpdated from '../events/ProjectNameUpdated';
import CannotModifyClosedProject from '../errors/CannotModifyClosedProject';
import ProjectNeedsToBeClosedBeforeDeleteIt from '../errors/ProjectNeedsToBeClosedBeforeDeleteIt';
import type ProjectParams from '../interfaces/ProjectParams';
import BackgroundType from '../objects/BackgroundType';
import ProjectBackGroundColor from '../objects/ProjectBackGroundColor';
import ProjectBackGroundImage from '../objects/ProjectBackGroundImage';
import ProjectDescription from '../objects/ProjectDescription';
import ProjectId from '../objects/ProjectId';
import ProjectName from '../objects/ProjectName';
import ProjectSetting from '../objects/ProjectSetting';
import ProjectStatus from '../objects/ProjectStatus';
import { AllowedColors } from '../../../shared/core/types/AllowedColors';
import type { AllowedAttachments } from '../../../shared/core/types/AllowedAttachment.types';
import type ProjectBackgroundImageParams from '../interfaces/ProjectBackgroundImageParams';
import InvalidPositionInProject from '../errors/InvalidPositionInProject';
import ConflictDuplicateResource from '../../../shared/core/errors/ConflictDuplicatedResource';
import PositiveInteger from '../../../shared/core/objects/PositiveInteger';
import ResourceNotFound from '../../../shared/core/errors/ResourceNotFound';
import ID from '../../../shared/core/objects/ID';

export default class Project extends Entity {
  private readonly id!: ProjectId;
  private status!: ProjectStatus;
  private projectName!: ProjectName;
  private projectDescription!: ProjectDescription | None;
  private background!: ProjectBackGroundImage | ProjectBackGroundColor;
  private backgroundType!: BackgroundType;
  private lists!: List[];
  private commentAuthorization!: ProjectSetting;
  private inmutableComment!: boolean;
  private addMemberSettings!: ProjectSetting;
  private createResourcesSettings!: ProjectSetting;
  private showCompletedTasks!: boolean;
  private invitaionToken!: ID | None;

  private constructor(
    id: ProjectId,
    status: ProjectStatus,
    projectName: ProjectName,
    projectDescription: ProjectDescription | None,
    background: ProjectBackGroundImage | ProjectBackGroundColor,
    backgroundType: BackgroundType,
    lists: List[],
    commentAuthorization: ProjectSetting,
    inmutableComment: boolean,
    addMemberSettings: ProjectSetting,
    createResourcesSettings: ProjectSetting,
    showCompletedTasks: boolean,
    invitaionToken: ID | None = new None(),
  ) {
    super(id, id);
    this.id = id;
    this.status = status;
    this.projectName = projectName;
    this.projectDescription = projectDescription;
    this.background = background;
    this.backgroundType = backgroundType;
    this.lists = lists;
    this.commentAuthorization = commentAuthorization;
    this.inmutableComment = inmutableComment;
    this.addMemberSettings = addMemberSettings;
    this.createResourcesSettings = createResourcesSettings;
    this.showCompletedTasks = showCompletedTasks;
    this.invitaionToken = invitaionToken;
    this.ensureBackgroundMatchesType();
  }

  public static create(
    id: ProjectId,
    projectName: ProjectName,
    projectDescription: ProjectDescription | None,
    background: ProjectBackGroundImage | ProjectBackGroundColor,
    backgroundType: BackgroundType,
    lists: List[],
    commentAuthorization: ProjectSetting,
    inmutableComment: boolean,
    addMemberSettings: ProjectSetting,
    createResourcesSettings: ProjectSetting,
    showCompletedTasks: boolean,
    actor: IdEntity,
    key: string,
  ): Project {
    const project = new Project(
      id,
      ProjectStatus.open(),
      projectName,
      projectDescription,
      background,
      backgroundType,
      lists,
      commentAuthorization,
      inmutableComment,
      addMemberSettings,
      createResourcesSettings,
      showCompletedTasks,
    );

    project.create();
    project.addEvent(new ProjectCreated(key, DateTime.now(), actor, id, project.toPrimitives()));
    return project;
  }

  public static fromPrimitives(params: ProjectParams): Project {
    const id = new ProjectId(params.id);
    const backgroundType = BackgroundType.create(params.backgroundType);
    const imageParams = params.background as ProjectBackgroundImageParams;
    const background = backgroundType.isImage()
      ? new ProjectBackGroundImage(new Attachment(
        new Url(imageParams.url),
        imageParams.type as AllowedAttachments,
        new Text(imageParams.name),
        new IntNumber(imageParams.size),
      ))
      : new ProjectBackGroundColor(params.background as AllowedColors);

    const project = new Project(
      id,
      ProjectStatus.create(params.status),
      new ProjectName(params.projectName),
      params.projectDescription ? new ProjectDescription(params.projectDescription) : new None(),
      background,
      backgroundType,
      params.lists,
      new ProjectSetting(params.commentAuthorization),
      params.inmutableComment,
      new ProjectSetting(params.addMemberSettings),
      new ProjectSetting(params.createResourcesSettings),
      params.showCompletedTasks,
      params.invitaionToken ? ID.fromString(params.invitaionToken) : new None()
    );

    project.build(new Version(params.version), DeletedAt.createFromPrimitive(params.deletedAt));
    return project;
  }

  public close(key: string, actor: IdEntity): void {
    if (this.status.isClosed()) return;
    this.status = ProjectStatus.closed();
    this.addEvent(new ProjectClosed(key, DateTime.now(), actor, this.id));
  }

  public delete(key: string, actor: IdEntity): void {
    if (!this.status.isClosed()) throw new ProjectNeedsToBeClosedBeforeDeleteIt(this.id.getID());
    this.addEvent(new ProjectDeleted(key, DateTime.now(), actor, this.id));
    super.softDelete();
  }

  public updateProjectName(projectName: ProjectName, key: string, actor: IdEntity): void {
    this.ensureCanBeModified();
    this.projectName = projectName;
    this.addEvent(new ProjectNameUpdated(key, DateTime.now(), actor, this.id, projectName));
  }

  public updateProjectDescription(projectDescription: ProjectDescription | None, key: string, actor: IdEntity): void {
    this.ensureCanBeModified();
    this.projectDescription = projectDescription;
    this.addEvent(new ProjectDescriptionUpdated(key, DateTime.now(), actor, this.id, projectDescription));
  }

  public updateProjectImage(background: ProjectBackGroundImage, key: string, actor: IdEntity): void {
    this.ensureCanBeModified();
    this.background = background;
    this.backgroundType = BackgroundType.image();
    this.addEvent(new ProjectBackgroundImageUpdated(key, DateTime.now(), actor, this.id, background));
  }

  public updateProjectColor(background: ProjectBackGroundColor, key: string, actor: IdEntity): void {
    this.ensureCanBeModified();
    this.background = background;
    this.backgroundType = BackgroundType.color();
    this.addEvent(new ProjectColorUpdated(key, DateTime.now(), actor, this.id, background));
  }

  public changeCommentSettings(commentAuthorization: ProjectSetting, key: string, actor: IdEntity): void {
    this.ensureCanBeModified();
    this.commentAuthorization = commentAuthorization;
    this.addEvent(new ProjectCommentSettingsUpdated(key, DateTime.now(), actor, this.id, commentAuthorization));
  }

  public changeAddMemberSettings(addMemberSettings: ProjectSetting, key: string, actor: IdEntity): void {
    this.ensureCanBeModified();
    this.addMemberSettings = addMemberSettings;
    this.addEvent(new ProjectAddMemberSettingsUpdated(key, DateTime.now(), actor, this.id, addMemberSettings));
  }

  public changeResourceCreationSettings(createResourcesSettings: ProjectSetting, key: string, actor: IdEntity): void {
    this.ensureCanBeModified();
    this.createResourcesSettings = createResourcesSettings;
    this.addEvent(new ProjectCreateResourceSettingUpdated(key, DateTime.now(), actor, this.id, createResourcesSettings));
  }

  public changeImmutableCommentSettings(inmutableComment: boolean, key: string, actor: IdEntity): void {
    this.ensureCanBeModified();
    this.inmutableComment = inmutableComment;
    this.addEvent(new ProjectCommentImmutableSetupTo(key, DateTime.now(), actor, this.id, inmutableComment));
  }

  public showCompletedTaskEvents(key: string, actor: IdEntity): void {
    this.ensureCanBeModified();
    if (this.showCompletedTasks) return;
    this.showCompletedTasks = true;
    this.addEvent(new ProjectCompletedTasksVisibilityUpdated(key, DateTime.now(), actor, this.id, this.showCompletedTasks));
  }

  public unshowCompletedTaskEvents(key: string, actor: IdEntity): void {
    this.ensureCanBeModified();
    if (!this.showCompletedTasks) return;
    this.showCompletedTasks = false;
    this.addEvent(new ProjectCompletedTasksVisibilityUpdated(key, DateTime.now(), actor, this.id, this.showCompletedTasks));
  }

  public addList(list: List): void {
    this.ensureCanBeModified();
    if(this.lists.find((existingList) => existingList.getID().getID() === list.getID().getID())) {
      throw new ConflictDuplicateResource(`A list with ID ${list.getID().getID()} already exists in the project.`);
    }
    if(list.getPosition().getValue() > this.lists.length + 1 || list.getPosition().getValue() < 1) {
      throw new InvalidPositionInProject(this.id.getID());
    }
    
    const list1 = this.lists.slice(0, list.getPosition().getValue() - 1);
    const list2 = this.lists.slice(list.getPosition().getValue() -1);

    list2.forEach(l => l.moveByOther(new PositiveInteger(l.getPosition().getValue() + 1)));
    this.lists = [...list1, list, ...list2];
  }

  public removeList(listId: string): void {
    this.ensureCanBeModified();
    if(!this.lists.find(l => l.getID().getID() === listId)) {
      throw new ResourceNotFound(`The list with id: ${listId} does not exists in project with id: ${this.getID().getID()}`, {listId, projectId: this.getID().getID()});
    }

    this.lists = this.lists.filter(l => l.getID().getID() !== listId);
  }

  public generateInvitationToken(): string {
    this.ensureCanBeModified();
    if(this.invitaionToken instanceof ID) {
      return this.invitaionToken.getId();
    }
    this.invitaionToken = ID.generateId();
    return (this.invitaionToken as ID).getId();
  }

  public invalidateInvitationToken(): void {
    this.ensureCanBeModified();
    this.invitaionToken = new None();
  }

  public getId(): ProjectId {
    return this.id;
  }

  public getStatus(): ProjectStatus {
    return this.status;
  }

  public getProjectName(): ProjectName {
    return this.projectName;
  }

  public getProjectDescription(): ProjectDescription | None {
    return this.projectDescription;
  }

  public getBackground(): ProjectBackGroundImage | ProjectBackGroundColor {
    return this.background;
  }

  public getBackgroundType(): BackgroundType {
    return this.backgroundType;
  }

  public getLists(): List[] {
    return [...this.lists];
  }

  public getCommentAuthorization(): ProjectSetting {
    return this.commentAuthorization;
  }

  public isCommentInmutable(): boolean {
    return this.inmutableComment;
  }

  public getAddMemberSettings(): ProjectSetting {
    return this.addMemberSettings;
  }

  public getCreateResourcesSettings(): ProjectSetting {
    return this.createResourcesSettings;
  }

  public shouldShowCompletedTasks(): boolean {
    return this.showCompletedTasks;
  }

  public toPrimitives(): ProjectParams {
    return {
      id: this.id.getID(),
      status: this.status.getStatus(),
      projectName: this.projectName.getName(),
      projectDescription: this.projectDescription instanceof None ? null : this.projectDescription.getDescription(),
      background: this.background instanceof ProjectBackGroundImage ? {
        url: this.background.getImage().getUrl().getUrl(),
        type: this.background.getImage().getType(),
        name: this.background.getImage().getName().getText(),
        size: this.background.getImage().getSize().getValue(),
      } : this.background.getColor(),
      backgroundType: this.backgroundType.getType(),
      lists: this.lists,
      commentAuthorization: this.commentAuthorization.getSetting(),
      inmutableComment: this.inmutableComment,
      addMemberSettings: this.addMemberSettings.getSetting(),
      createResourcesSettings: this.createResourcesSettings.getSetting(),
      showCompletedTasks: this.showCompletedTasks,
      invitaionToken: this.invitaionToken instanceof None ? null : (this.invitaionToken as ID).getId(),
      version: super.getVersion().valueOf(),
      deletedAt: super.getDeletedAt().toPrimitive(),
    };
  }

  private ensureCanBeModified(): void {
    if (this.status.isClosed()) throw new CannotModifyClosedProject(this.id.getID());
  }

  private ensureBackgroundMatchesType(): void {
    if (this.backgroundType.isImage() && !(this.background instanceof ProjectBackGroundImage)) {
      throw new InvalidOperation('Project background must be an image when background type is IMAGE');
    }

    if (this.backgroundType.isColor() && !(this.background instanceof ProjectBackGroundColor)) {
      throw new InvalidOperation('Project background must be a color when background type is COLOR');
    }
  }
}
