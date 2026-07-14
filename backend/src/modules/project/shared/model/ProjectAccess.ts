import Unauthorized from '../../../shared/core/errors/Unauthorized';
import IdEntity from '../../../shared/core/objects/IdEntity';
import { AllowedMemberRoles } from '../../../shared/core/types/AllowedMemberRoles';
import type { AllowedProjectSetting } from '../../../shared/core/types/AllowedProjectSetting';

interface AccessParams{
    idProject: string;
    idMember: string;
    memberRole: AllowedMemberRoles;
    commentAuthorization: AllowedProjectSetting;
    immutableComment: boolean;
    memberSettings: AllowedProjectSetting;
    resourcesSettings: AllowedProjectSetting;
};

export default class ProjectAccess{
    private readonly idProject!: IdEntity;
    private readonly idMember!: IdEntity;
    private readonly memberRole!: AllowedMemberRoles;
    private readonly commentAuthorization!: AllowedProjectSetting;
    private readonly immutableComment!: boolean;
    private readonly memberSettings!: AllowedProjectSetting;
    private readonly resourcesSettings!: AllowedProjectSetting;

    constructor(params: AccessParams){
        this.idProject = new IdEntity(params.idProject);
        this.idMember = new IdEntity(params.idMember);
        this.memberRole = params.memberRole;
        this.commentAuthorization = params.commentAuthorization;
        this.immutableComment = params.immutableComment;
        this.memberSettings = params.memberSettings;
        this.resourcesSettings = params.resourcesSettings;
    }

    public resourceManagement(): void{
        if(this.memberRole !== AllowedMemberRoles.admin || this.resourcesSettings !== AllowedMemberRoles.member){
            throw new Unauthorized(`The user with id: ${this.idMember} is not autohrized to access due to is not a member, dont have enough role level or project policies dont allow it`);
        }
    }

    public comment(): void{
        if(this.memberRole !== AllowedMemberRoles.admin || this.commentAuthorization !== AllowedMemberRoles.member){
            throw new Unauthorized(`The user with id: ${this.idMember} is not autohrized to access due to is not a member, dont have enough role level or project policies dont allow it`);
        }
    }

    public unComment(): void{
        if(this.immutableComment) throw new Unauthorized(`Comment are inmutable for project with id:${this.idProject}`)
        if(this.memberRole !== AllowedMemberRoles.admin || this.resourcesSettings !== AllowedMemberRoles.member){
            throw new Unauthorized(`The user with id: ${this.idMember} is not autohrized to access due to is not a member, dont have enough role level or project policies dont allow it`);
        }
    }

    public memberManagement(): void{
        if(this.memberRole !== AllowedMemberRoles.admin || this.memberSettings !== AllowedMemberRoles.member){
            throw new Unauthorized(`The user with id: ${this.idMember} is not autohrized to access due to is not a member, dont have enough role level or project policies dont allow it`);
        }
    }

    public getIdMember(): IdEntity{
        return this.idMember;
    }

    public getIDProject(): IdEntity{
        return this.idProject;
    }
}
