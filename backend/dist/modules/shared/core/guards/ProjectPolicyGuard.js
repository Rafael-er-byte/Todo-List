import InvalidOperation from "../errors/InvalidOperation";
import InvalidParameters from "../errors/InvalidParameters";
import IdEntity from "../objects/IdEntity";
import { AccessType } from "../types/AccessType";
export default class ProjectPolicyGuard {
    constructor(repo) {
        this.repo = repo;
    }
    async guard(data, accessType) {
        if (!data.idProject || !data.idMember)
            throw new InvalidParameters('The id of project and id member are required to access');
        const projectAccess = await this.repo.getMemberFromProjectWithProjectPolicy(new IdEntity(data.idProject), new IdEntity(data.idMember));
        switch (accessType) {
            case AccessType.resource:
                projectAccess.resourceManagement();
                break;
            case AccessType.member:
                projectAccess.memberManagement();
                break;
            case AccessType.comment:
                projectAccess.comment();
                break;
            case AccessType.removeComment:
                projectAccess.unComment();
                break;
            default:
                throw new InvalidOperation('Invalid access type', accessType);
        }
    }
}
//# sourceMappingURL=ProjectPolicyGuard.js.map