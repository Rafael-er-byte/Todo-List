import Entity from '../../../shared/core/model/Entity';
import DateTime from '../../../shared/core/objects/DateTime';
import IdEntity from '../../../shared/core/objects/IdEntity';
import None from '../../../shared/core/objects/None';
import Attachment from '../../../shared/core/objects/Attachment';
import IntNumber from '../../../shared/core/objects/IntNumber';
import Text from '../../../shared/core/objects/Text';
import Url from '../../../shared/core/objects/URL';
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
import ProjectNeedsToBeClosedBeforeDeleteIt from '../errors/ProjectNeedsToBeClosedBeforeDeleteIt';
import type ProjectParams from '../interfaces/ProjectParams';
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
import { AllowedBackgroundType } from '../types/AllowedBackgroundType';
import type ProjectList from '../objects/ProjectList';
import CannotModifyClosedProject from '../errors/CannotModifyClosedProject';

export default class Project extends Entity {
  private readonly id!: ProjectId;
  private status!: ProjectStatus;
  private projectName!: ProjectName;
  private projectDescription!: ProjectDescription | None;
  private background!: ProjectBackGroundImage | ProjectBackGroundColor;
  private lists!: ProjectList[];
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
    lists: ProjectList[],
    commentAuthorization: ProjectSetting,
    inmutableComment: boolean,
    addMemberSettings: ProjectSetting,
    createResourcesSettings: ProjectSetting,
    showCompletedTasks: boolean,
    invitaionToken: ID | None = new None(),
  ) {
    super(id);
    this.id = id;
    this.status = status;
    this.projectName = projectName;
    this.projectDescription = projectDescription;
    this.background = background;
    this.lists = lists;
    this.commentAuthorization = commentAuthorization;
    this.inmutableComment = inmutableComment;
    this.addMemberSettings = addMemberSettings;
    this.createResourcesSettings = createResourcesSettings;
    this.showCompletedTasks = showCompletedTasks;
    this.invitaionToken = invitaionToken;
  }

  public static create(
    params: Omit<ProjectParams, 'status' | 'invitaionToken'> & { actor: string; key: string },
  ): Project {
    const id = new ProjectId(params.id);
    const projectName = new ProjectName(params.projectName);
    const projectDescription = params.projectDescription ? new ProjectDescription(params.projectDescription) : new None();
    const imageParams = params.background as ProjectBackgroundImageParams;
    const background = params.backgroundType === AllowedBackgroundType.image
      ? new ProjectBackGroundImage(new Attachment(
        new Url(imageParams.url),
        imageParams.type as AllowedAttachments,
        new Text(imageParams.name),
        new IntNumber(imageParams.size),
      ))
      : new ProjectBackGroundColor(params.background as AllowedColors);
    const actor = new IdEntity(params.actor);
    const project = new Project(
      id,
      ProjectStatus.open(),
      projectName,
      projectDescription,
      background,
      params.lists,
      new ProjectSetting(params.commentAuthorization),
      params.inmutableComment,
      new ProjectSetting(params.addMemberSettings),
      new ProjectSetting(params.createResourcesSettings),
      params.showCompletedTasks,
    );

    project.addEvent(new ProjectCreated(params.key, DateTime.now(), actor, id, project.toPrimitives()));
    return project;
  }

  public static fromPrimitives(params: ProjectParams): Project {
    const id = new ProjectId(params.id);
    const imageParams = params.background as ProjectBackgroundImageParams;
    const background = params.backgroundType === AllowedBackgroundType.image
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
      params.lists,
      new ProjectSetting(params.commentAuthorization),
      params.inmutableComment,
      new ProjectSetting(params.addMemberSettings),
      new ProjectSetting(params.createResourcesSettings),
      params.showCompletedTasks,
      params.invitaionToken ? ID.fromString(params.invitaionToken) : new None()
    );

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
    this.addEvent(new ProjectBackgroundImageUpdated(key, DateTime.now(), actor, this.id, background));
  }

  public updateProjectColor(background: ProjectBackGroundColor, key: string, actor: IdEntity): void {
    this.ensureCanBeModified();
    this.background = background;
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
    if (this.showCompletedTasks) return;
    this.ensureCanBeModified();
    this.showCompletedTasks = true;
    this.addEvent(new ProjectCompletedTasksVisibilityUpdated(key, DateTime.now(), actor, this.id, this.showCompletedTasks));
  }

  public unshowCompletedTaskEvents(key: string, actor: IdEntity): void {
    if (!this.showCompletedTasks) return;
    this.ensureCanBeModified();
    this.showCompletedTasks = false;
    this.addEvent(new ProjectCompletedTasksVisibilityUpdated(key, DateTime.now(), actor, this.id, this.showCompletedTasks));
  }

  public addList(Projectlist: ProjectList): void {
    this.ensureCanBeModified();
    if(this.lists.find((existingProjectList) => existingProjectList.idList.getID() === Projectlist.idList.getID())) {
      throw new ConflictDuplicateResource(`A Projectlist with ID ${Projectlist.idList.getID()} already exists in the project.`);
    }
    if(Projectlist.position.getValue() > this.lists.length + 1 || Projectlist.position.getValue() < 1) {
      throw new InvalidPositionInProject(this.id.getID());
    }
    
    const Projectlist1 = this.lists.slice(0, Projectlist.position.getValue() - 1);
    const Projectlist2 = this.lists.slice(Projectlist.position.getValue() -1);

    Projectlist2.forEach(l => l.position = new PositiveInteger(l.position.getValue() + 1));
    this.lists = [...Projectlist1, Projectlist, ...Projectlist2];
  }

  public removeList(listId: IdEntity): void {
    this.ensureCanBeModified();
    const list = this.lists.find(l => l.idList.getID() === listId.getID());
    
    if(!list) {
      throw new ResourceNotFound(`The list with id: ${listId.getID()} does not exists in project with id: ${this.getID()}`, {listId: listId.getID(), projectId: this.getID()});
    }

    const ProjectlistToReorganize = this.lists.slice(list.position.getValue() -1);

    ProjectlistToReorganize.forEach(l => l.position = new PositiveInteger(l.position.getValue() - 1));
    this.lists = this.lists.filter(l => l.idList.getID() !== list.idList.getID());
  }

  public generateInvitationToken(): string {
    this.invitaionToken = ID.generateId();
    return (this.invitaionToken as ID).toString();
  }

  public invalidateInvitationToken(): void {
    this.invitaionToken = new None();
  }

  public shouldShowCompletedTasks(): boolean {
    return this.showCompletedTasks;
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

  public getBackgroundType(): AllowedBackgroundType {
    return (this.background instanceof ProjectBackGroundColor)? AllowedBackgroundType.color: AllowedBackgroundType.image;
  }

  public getlists(): ProjectList[] {
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

  public getToken(): string | None{
    this.ensureCanBeModified();
    return this.invitaionToken instanceof ID? this.invitaionToken.toString(): new None();
  }

  private ensureCanBeModified(): void{
    if(this.status.isClosed()) throw new CannotModifyClosedProject(this.id.getID());
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
      backgroundType: this.background instanceof ProjectBackGroundImage? AllowedBackgroundType.image: AllowedBackgroundType.color,
      lists: this.lists,
      commentAuthorization: this.commentAuthorization.getSetting(),
      inmutableComment: this.inmutableComment,
      addMemberSettings: this.addMemberSettings.getSetting(),
      createResourcesSettings: this.createResourcesSettings.getSetting(),
      showCompletedTasks: this.showCompletedTasks,
      invitaionToken: this.invitaionToken instanceof None ? null : (this.invitaionToken as ID).toString(),
    };
  }
}
