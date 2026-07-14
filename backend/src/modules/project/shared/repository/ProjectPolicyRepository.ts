import type ProjectAccess from "../model/ProjectAccess";
import type IdEntity from "../../../shared/core/objects/IdEntity";

export default interface ProjectAccessRepository{
    getMemberFromProjectWithProjectPolicy(idProject: IdEntity, idMember: IdEntity): Promise<ProjectAccess>
}
