import Unauthorized from "../errors/Unauthorized";
import IdEntity from "../objects/IdEntity";
import { AllowedMemberRoles } from "../types/AllowedMemberRoles";
;
export default class ProjectAccess {
    constructor(params) {
        this.idProject = new IdEntity(params.idProject);
        this.idMember = new IdEntity(params.idMember);
        this.memberRole = params.memberRole;
        this.commentAuthorization = params.commentAuthorization;
        this.immutableComment = params.immutableComment;
        this.memberSettings = params.memberSettings;
        this.resourcesSettings = params.resourcesSettings;
    }
    resourceManagement() {
        if (this.memberRole !== AllowedMemberRoles.admin || this.resourcesSettings !== AllowedMemberRoles.member) {
            throw new Unauthorized(`The user with id: ${this.idMember} is not autohrized to access due to is not a member, dont have enough role level or project policies dont allow it`);
        }
    }
    comment() {
        if (this.memberRole !== AllowedMemberRoles.admin || this.commentAuthorization !== AllowedMemberRoles.member) {
            throw new Unauthorized(`The user with id: ${this.idMember} is not autohrized to access due to is not a member, dont have enough role level or project policies dont allow it`);
        }
    }
    unComment() {
        if (this.immutableComment)
            throw new Unauthorized(`Comment are inmutable for project with id:${this.idProject}`);
        if (this.memberRole !== AllowedMemberRoles.admin || this.resourcesSettings !== AllowedMemberRoles.member) {
            throw new Unauthorized(`The user with id: ${this.idMember} is not autohrized to access due to is not a member, dont have enough role level or project policies dont allow it`);
        }
    }
    memberManagement() {
        if (this.memberRole !== AllowedMemberRoles.admin || this.memberSettings !== AllowedMemberRoles.member) {
            throw new Unauthorized(`The user with id: ${this.idMember} is not autohrized to access due to is not a member, dont have enough role level or project policies dont allow it`);
        }
    }
    getIdMember() {
        return this.idMember;
    }
    getIDProject() {
        return this.idProject;
    }
}
//# sourceMappingURL=ProjectAccess.js.map