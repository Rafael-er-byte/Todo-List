import type ProjectAccess from "../model/ProjectAccess";
import type IdEntity from "../objects/IdEntity";
export default interface ProjectAccessRepository {
    getMemberFromProjectWithProjectPolicy(idProject: IdEntity, idMember: IdEntity): Promise<ProjectAccess>;
}
//# sourceMappingURL=ProjectPolicyRepository.d.ts.map