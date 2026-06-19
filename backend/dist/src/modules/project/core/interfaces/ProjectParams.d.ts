import type List from '../../../list/core/model/List';
import type { AllowedColors } from '../../../shared/core/types/AllowedColors';
import type { AllowedBackgroundType } from '../types/AllowedBackgroundType';
import type { AllowedProjectSetting } from '../types/AllowedProjectSetting';
import type { AllowedProjectStatus } from '../types/AllowedProjectStatus';
import type ProjectBackgroundImageParams from './ProjectBackgroundImageParams';
export default interface ProjectParams {
    id: string;
    status: AllowedProjectStatus;
    projectName: string;
    projectDescription: string | null;
    background: ProjectBackgroundImageParams | AllowedColors;
    backgroundType: AllowedBackgroundType;
    lists: List[];
    commentAuthorization: AllowedProjectSetting;
    inmutableComment: boolean;
    addMemberSettings: AllowedProjectSetting;
    createResourcesSettings: AllowedProjectSetting;
    showCompletedTasks: boolean;
    invitaionToken: string | null;
    deletedAt: Date | null;
}
//# sourceMappingURL=ProjectParams.d.ts.map