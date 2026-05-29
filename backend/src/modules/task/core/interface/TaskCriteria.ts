import type IdEntity from '../../../shared/core/objects/IdEntity';
import type { AllowedTaskState } from '../types/AllowedTaskState';

export default interface TaskCriteria {
  limit: number;
  page: number;
  archived:"ALL" | "ACTIVE" | "ARCHIVED";
  withCategory: boolean;
  wihtAssigned: boolean;
  idProject: IdEntity;
  
  nameLike?: string;
  categories?: string[];
  status?: AllowedTaskState;
  isOverDue?: boolean;
  isStarted?: boolean;
  assingned?: string[];
}
