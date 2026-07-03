import type { AllowedColors } from '../../../../shared/core/types/AllowedColors';
import type { AllowedProjectSetting } from '../../../../shared/core/types/AllowedProjectSetting';
import type ListEntry from '../aggregates/ListEntry';
import type { AllowedBackgroundType } from '../types/AllowedBackgroundType';
import type { AllowedProjectStatus } from '../types/AllowedProjectStatus';
import type ProjectBackgroundImageParams from './ProjectBackgroundImageParams';
export default interface ProjectParams {
    id: string;
    status: AllowedProjectStatus;
    projectName: string;
    projectDescription: string | null;
    background: ProjectBackgroundImageParams | AllowedColors;
    backgroundType: AllowedBackgroundType;
    lists: ListEntry[];
    commentAuthorization: AllowedProjectSetting;
    inmutableComment: boolean;
    addMemberSettings: AllowedProjectSetting;
    createResourcesSettings: AllowedProjectSetting;
    showCompletedTasks: boolean;
    invitaionToken: string | null;
}
//# sourceMappingURL=ProjectParams.d.ts.map