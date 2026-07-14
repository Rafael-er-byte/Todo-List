import InvalidOperation from '../../../shared/core/errors/InvalidOperation';
import InvalidParameters from '../../../shared/core/errors/InvalidParameters';
import type { CommandDto } from '../../../shared/core/handler/DTO';
import IdEntity from '../../../shared/core/objects/IdEntity';
import type ProjectAccessRepository from "../repository/ProjectPolicyRepository";
import { AccessType } from '../../../shared/core/types/AccessType';

export default class ProjectPolicyGuard{
    constructor(private repo: ProjectAccessRepository){}

    public async guard(data: CommandDto, accessType: AccessType): Promise<void>{
        if(!data.idProject || !data.idMember)throw new InvalidParameters('The id of project and id member are required to access');
    
        const projectAccess = await this.repo.getMemberFromProjectWithProjectPolicy(new IdEntity(data.idProject as string), new IdEntity(data.idMember as string));
    
        switch(accessType){
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
