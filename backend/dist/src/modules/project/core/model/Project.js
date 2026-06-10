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
import BackgroundType from '../objects/BackgroundType';
import ProjectBackGroundColor from '../objects/ProjectBackGroundColor';
import ProjectBackGroundImage from '../objects/ProjectBackGroundImage';
import ProjectDescription from '../objects/ProjectDescription';
import ProjectId from '../objects/ProjectId';
import ProjectName from '../objects/ProjectName';
import ProjectSetting from '../objects/ProjectSetting';
import ProjectStatus from '../objects/ProjectStatus';
import { AllowedBackgroundType } from '../types/AllowedBackgroundType';
import { AllowedColors } from '../../../shared/core/types/AllowedColors';
export default class Project extends Entity {
    constructor(id, status, projectName, projectDescription, background, backgroundType, lists, commentAuthorization, inmutableComment, addMemberSettings, createResourcesSettings, showCompletedTasks) {
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
        this.ensureBackgroundMatchesType();
    }
    static create(id, projectName, projectDescription, background, backgroundType, lists, commentAuthorization, inmutableComment, addMemberSettings, createResourcesSettings, showCompletedTasks, actor, key) {
        const project = new Project(id, ProjectStatus.open(), projectName, projectDescription, background, backgroundType, lists, commentAuthorization, inmutableComment, addMemberSettings, createResourcesSettings, showCompletedTasks);
        project.create();
        project.addEvent(new ProjectCreated(key, DateTime.now(), actor, id, project.toPrimitives()));
        return project;
    }
    static fromPrimitives(params) {
        const id = new ProjectId(params.id);
        const backgroundType = BackgroundType.create(params.backgroundType);
        const imageParams = params.background;
        const background = backgroundType.isImage()
            ? new ProjectBackGroundImage(new Attachment(new Url(imageParams.url), imageParams.type, new Text(imageParams.name), new IntNumber(imageParams.size)))
            : new ProjectBackGroundColor(params.background);
        const project = new Project(id, ProjectStatus.create(params.status), new ProjectName(params.projectName), params.projectDescription ? new ProjectDescription(params.projectDescription) : new None(), background, backgroundType, params.lists, new ProjectSetting(params.commentAuthorization), params.inmutableComment, new ProjectSetting(params.addMemberSettings), new ProjectSetting(params.createResourcesSettings), params.showCompletedTasks);
        project.build(new Version(params.version), DeletedAt.createFromPrimitive(params.deletedAt));
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
        this.ensureCanBeModified();
        this.projectName = projectName;
        this.addEvent(new ProjectNameUpdated(key, DateTime.now(), actor, this.id, projectName));
    }
    updateProjectDescription(projectDescription, key, actor) {
        this.ensureCanBeModified();
        this.projectDescription = projectDescription;
        this.addEvent(new ProjectDescriptionUpdated(key, DateTime.now(), actor, this.id, projectDescription));
    }
    updateProjectImage(background, key, actor) {
        this.ensureCanBeModified();
        this.background = background;
        this.backgroundType = BackgroundType.image();
        this.addEvent(new ProjectBackgroundImageUpdated(key, DateTime.now(), actor, this.id, background));
    }
    updateProjectColor(background, key, actor) {
        this.ensureCanBeModified();
        this.background = background;
        this.backgroundType = BackgroundType.color();
        this.addEvent(new ProjectColorUpdated(key, DateTime.now(), actor, this.id, background));
    }
    changeCommentSettings(commentAuthorization, key, actor) {
        this.ensureCanBeModified();
        this.commentAuthorization = commentAuthorization;
        this.addEvent(new ProjectCommentSettingsUpdated(key, DateTime.now(), actor, this.id, commentAuthorization));
    }
    changeAddMemberSettings(addMemberSettings, key, actor) {
        this.ensureCanBeModified();
        this.addMemberSettings = addMemberSettings;
        this.addEvent(new ProjectAddMemberSettingsUpdated(key, DateTime.now(), actor, this.id, addMemberSettings));
    }
    changeResourceCreationSettings(createResourcesSettings, key, actor) {
        this.ensureCanBeModified();
        this.createResourcesSettings = createResourcesSettings;
        this.addEvent(new ProjectCreateResourceSettingUpdated(key, DateTime.now(), actor, this.id, createResourcesSettings));
    }
    changeImmutableCommentSettings(inmutableComment, key, actor) {
        this.ensureCanBeModified();
        this.inmutableComment = inmutableComment;
        this.addEvent(new ProjectCommentImmutableSetupTo(key, DateTime.now(), actor, this.id, inmutableComment));
    }
    showCompletedTaskEvents(key, actor) {
        this.ensureCanBeModified();
        if (this.showCompletedTasks)
            return;
        this.showCompletedTasks = true;
        this.addEvent(new ProjectCompletedTasksVisibilityUpdated(key, DateTime.now(), actor, this.id, this.showCompletedTasks));
    }
    unshowCompletedTaskEvents(key, actor) {
        this.ensureCanBeModified();
        if (!this.showCompletedTasks)
            return;
        this.showCompletedTasks = false;
        this.addEvent(new ProjectCompletedTasksVisibilityUpdated(key, DateTime.now(), actor, this.id, this.showCompletedTasks));
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
        return this.backgroundType;
    }
    getLists() {
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
    shouldShowCompletedTasks() {
        return this.showCompletedTasks;
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
            backgroundType: this.backgroundType.getType(),
            lists: this.lists,
            commentAuthorization: this.commentAuthorization.getSetting(),
            inmutableComment: this.inmutableComment,
            addMemberSettings: this.addMemberSettings.getSetting(),
            createResourcesSettings: this.createResourcesSettings.getSetting(),
            showCompletedTasks: this.showCompletedTasks,
            version: super.getVersion().valueOf(),
            deletedAt: super.getDeletedAt().toPrimitive(),
        };
    }
    ensureCanBeModified() {
        if (this.status.isClosed())
            throw new CannotModifyClosedProject(this.id.getID());
    }
    ensureBackgroundMatchesType() {
        if (this.backgroundType.isImage() && !(this.background instanceof ProjectBackGroundImage)) {
            throw new InvalidOperation('Project background must be an image when background type is IMAGE');
        }
        if (this.backgroundType.isColor() && !(this.background instanceof ProjectBackGroundColor)) {
            throw new InvalidOperation('Project background must be a color when background type is COLOR');
        }
    }
}
//# sourceMappingURL=Project.js.map