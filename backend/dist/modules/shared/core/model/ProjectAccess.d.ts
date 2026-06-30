import IdEntity from "../objects/IdEntity";
import { AllowedMemberRoles } from "../types/AllowedMemberRoles";
import type { AllowedProjectSetting } from "../types/AllowedProjectSetting";
interface AccessParams {
    idProject: string;
    idMember: string;
    memberRole: AllowedMemberRoles;
    commentAuthorization: AllowedProjectSetting;
    immutableComment: boolean;
    memberSettings: AllowedProjectSetting;
    resourcesSettings: AllowedProjectSetting;
}
export default class ProjectAccess {
    private readonly idProject;
    private readonly idMember;
    private readonly memberRole;
    private readonly commentAuthorization;
    private readonly immutableComment;
    private readonly memberSettings;
    private readonly resourcesSettings;
    constructor(params: AccessParams);
    resourceManagement(): void;
    comment(): void;
    unComment(): void;
    memberManagement(): void;
    getIdMember(): IdEntity;
    getIDProject(): IdEntity;
}
export {};
//# sourceMappingURL=ProjectAccess.d.ts.map