import type IdEntity from '../../../shared/core/objects/IdEntity';
import type { AllowedTaskState } from '../types/AllowedTaskState';
export default interface TaskCriteria {
    limit: number;
    page: number;
    archived: "ALL" | "ACTIVE" | "ARCHIVED";
    idProject: IdEntity;
    nameLike?: string;
    lists?: string[];
    categories?: string[];
    status?: AllowedTaskState;
    isOverDue?: boolean;
    isStarted?: boolean;
    assigned?: string[];
}
//# sourceMappingURL=TaskCriteria.d.ts.map