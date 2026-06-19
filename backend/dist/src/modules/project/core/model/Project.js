import Entity from '../../../shared/core/model/Entity';
import DateTime from '../../../shared/core/objects/DateTime';
import DeletedAt from '../../../shared/core/objects/DeletedAt';
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
import ProjectBackGroundColor from '../objects/ProjectBackGroundColor';
import ProjectBackGroundImage from '../objects/ProjectBackGroundImage';
import ProjectDescription from '../objects/ProjectDescription';
import ProjectId from '../objects/ProjectId';
import ProjectName from '../objects/ProjectName';
import ProjectSetting from '../objects/ProjectSetting';
import ProjectStatus from '../objects/ProjectStatus';
import { AllowedColors } from '../../../shared/core/types/AllowedColors';
import InvalidPositionInProject from '../errors/InvalidPositionInProject';
import ConflictDuplicateResource from '../../../shared/core/errors/ConflictDuplicatedResource';
import PositiveInteger from '../../../shared/core/objects/PositiveInteger';
import ResourceNotFound from '../../../shared/core/errors/ResourceNotFound';
import ID from '../../../shared/core/objects/ID';
import { AllowedBackgroundType } from '../types/AllowedBackgroundType';
export default class Project extends Entity {
    constructor(id, status, projectName, projectDescription, background, lists, commentAuthorization, inmutableComment, addMemberSettings, createResourcesSettings, showCompletedTasks, invitaionToken = new None()) {
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
    static create(id, projectName, projectDescription, background, lists, commentAuthorization, inmutableComment, addMemberSettings, createResourcesSettings, showCompletedTasks, actor, key) {
        const project = new Project(id, ProjectStatus.open(), projectName, projectDescription, background, lists, commentAuthorization, inmutableComment, addMemberSettings, createResourcesSettings, showCompletedTasks);
        project.create();
        project.addEvent(new ProjectCreated(key, DateTime.now(), actor, id, project.toPrimitives()));
        return project;
    }
    static fromPrimitives(params) {
        const id = new ProjectId(params.id);
        const imageParams = params.background;
        const background = params.backgroundType === AllowedBackgroundType.image
            ? new ProjectBackGroundImage(new Attachment(new Url(imageParams.url), imageParams.type, new Text(imageParams.name), new IntNumber(imageParams.size)))
            : new ProjectBackGroundColor(params.background);
        const project = new Project(id, ProjectStatus.create(params.status), new ProjectName(params.projectName), params.projectDescription ? new ProjectDescription(params.projectDescription) : new None(), background, params.lists, new ProjectSetting(params.commentAuthorization), params.inmutableComment, new ProjectSetting(params.addMemberSettings), new ProjectSetting(params.createResourcesSettings), params.showCompletedTasks, params.invitaionToken ? ID.fromString(params.invitaionToken) : new None());
        project.build(DeletedAt.createFromPrimitive(params.deletedAt));
        return project;
    }
    close(key, actor) {
        if (this.status.isClosed())
            return;
        this.status = ProjectStatus.closed();
        this.addEvent(new ProjectClosed(key, DateTime.now(), actor, this.id));
    }
    delete(key, actor) {
        if (!this.status.isClosed())
            throw new ProjectNeedsToBeClosedBeforeDeleteIt(this.id.getID());
        this.addEvent(new ProjectDeleted(key, DateTime.now(), actor, this.id));
        super.softDelete();
    }
    updateProjectName(projectName, key, actor) {
        this.projectName = projectName;
        this.addEvent(new ProjectNameUpdated(key, DateTime.now(), actor, this.id, projectName));
    }
    updateProjectDescription(projectDescription, key, actor) {
        this.projectDescription = projectDescription;
        this.addEvent(new ProjectDescriptionUpdated(key, DateTime.now(), actor, this.id, projectDescription));
    }
    updateProjectImage(background, key, actor) {
        this.background = background;
        this.addEvent(new ProjectBackgroundImageUpdated(key, DateTime.now(), actor, this.id, background));
    }
    updateProjectColor(background, key, actor) {
        this.background = background;
        this.addEvent(new ProjectColorUpdated(key, DateTime.now(), actor, this.id, background));
    }
    changeCommentSettings(commentAuthorization, key, actor) {
        this.commentAuthorization = commentAuthorization;
        this.addEvent(new ProjectCommentSettingsUpdated(key, DateTime.now(), actor, this.id, commentAuthorization));
    }
    changeAddMemberSettings(addMemberSettings, key, actor) {
        this.addMemberSettings = addMemberSettings;
        this.addEvent(new ProjectAddMemberSettingsUpdated(key, DateTime.now(), actor, this.id, addMemberSettings));
    }
    changeResourceCreationSettings(createResourcesSettings, key, actor) {
        this.createResourcesSettings = createResourcesSettings;
        this.addEvent(new ProjectCreateResourceSettingUpdated(key, DateTime.now(), actor, this.id, createResourcesSettings));
    }
    changeImmutableCommentSettings(inmutableComment, key, actor) {
        this.inmutableComment = inmutableComment;
        this.addEvent(new ProjectCommentImmutableSetupTo(key, DateTime.now(), actor, this.id, inmutableComment));
    }
    showCompletedTaskEvents(key, actor) {
        if (this.showCompletedTasks)
            return;
        this.showCompletedTasks = true;
        this.addEvent(new ProjectCompletedTasksVisibilityUpdated(key, DateTime.now(), actor, this.id, this.showCompletedTasks));
    }
    unshowCompletedTaskEvents(key, actor) {
        if (!this.showCompletedTasks)
            return;
        this.showCompletedTasks = false;
        this.addEvent(new ProjectCompletedTasksVisibilityUpdated(key, DateTime.now(), actor, this.id, this.showCompletedTasks));
    }
    addProjectList(Projectlist) {
        if (this.lists.find((existingProjectList) => existingProjectList.idList.getID() === Projectlist.idList.getID())) {
            throw new ConflictDuplicateResource(`A Projectlist with ID ${Projectlist.idList.getID()} already exists in the project.`);
        }
        if (Projectlist.position.getValue() > this.lists.length + 1 || Projectlist.position.getValue() < 1) {
            throw new InvalidPositionInProject(this.id.getID());
        }
        const Projectlist1 = this.lists.slice(0, Projectlist.position.getValue() - 1);
        const Projectlist2 = this.lists.slice(Projectlist.position.getValue() - 1);
        Projectlist2.forEach(l => l.position = new PositiveInteger(l.position.getValue() + 1));
        this.lists = [...Projectlist1, Projectlist, ...Projectlist2];
    }
    removeProjectList(list) {
        if (!this.lists.find(l => l.idList.getID() === list.idList.getID())) {
            throw new ResourceNotFound(`The list with id: ${list.idList.getID()} does not exists in project with id: ${this.getID()}`, { listId: list.idList.getID(), projectId: this.getID() });
        }
        let ProjectlistToReorganize = this.lists.slice(list.position.getValue() - 1);
        ProjectlistToReorganize.forEach(l => l.position = new PositiveInteger(l.position.getValue() - 1));
        this.lists = this.lists.filter(l => l.idList.getID() !== list.idList.getID());
    }
    // Backwards-compatible wrappers
    addList(list) {
        this.addProjectList(list);
    }
    removeList(list) {
        this.removeProjectList(list);
    }
    generateInvitationToken() {
        this.invitaionToken = ID.generateId();
        return this.invitaionToken.getId();
    }
    invalidateInvitationToken() {
        this.invitaionToken = new None();
    }
    shouldShowCompletedTasks() {
        return this.showCompletedTasks;
    }
    getId() {
        return this.id;
    }
    getStatus() {
        return this.status;
    }
    getProjectName() {
        return this.projectName;
    }
    getProjectDescription() {
        return this.projectDescription;
    }
    getBackground() {
        return this.background;
    }
    getBackgroundType() {
        return (this.background instanceof ProjectBackGroundColor) ? AllowedBackgroundType.color : AllowedBackgroundType.image;
    }
    getlists() {
        return [...this.lists];
    }
    getCommentAuthorization() {
        return this.commentAuthorization;
    }
    isCommentInmutable() {
        return this.inmutableComment;
    }
    getAddMemberSettings() {
        return this.addMemberSettings;
    }
    getCreateResourcesSettings() {
        return this.createResourcesSettings;
    }
    getToken() {
        return this.invitaionToken instanceof ID ? this.invitaionToken.getId() : new None();
    }
    toPrimitives() {
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
            backgroundType: this.background instanceof ProjectBackGroundImage ? AllowedBackgroundType.image : AllowedBackgroundType.color,
            lists: this.lists,
            commentAuthorization: this.commentAuthorization.getSetting(),
            inmutableComment: this.inmutableComment,
            addMemberSettings: this.addMemberSettings.getSetting(),
            createResourcesSettings: this.createResourcesSettings.getSetting(),
            showCompletedTasks: this.showCompletedTasks,
            invitaionToken: this.invitaionToken instanceof None ? null : this.invitaionToken.getId(),
            deletedAt: super.getDeletedAt().toPrimitive(),
        };
    }
}
//# sourceMappingURL=Project.js.map