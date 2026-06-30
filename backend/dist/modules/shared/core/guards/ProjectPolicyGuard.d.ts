import type DTO from "../handler/DTO";
import type ProjectAccessRepository from "../repository/ProjectPolicyRepository";
import { AccessType } from "../types/AccessType";
export default class ProjectPolicyGuard {
    private repo;
    constructor(repo: ProjectAccessRepository);
    guard(data: DTO, accessType: AccessType): Promise<void>;
}
//# sourceMappingURL=ProjectPolicyGuard.d.ts.map