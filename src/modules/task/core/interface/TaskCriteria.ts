import type IdEntity from '../../../shared/core/objects/IdEntity';
import type { AllowedTaskState } from '../types/AllowedTaskState';

export default interface TaskCriteria {
  limit: number;
  page: number;
  nameLike: string;
  categories: string[];
  status: AllowedTaskState;
  assingned: string[];
  withCategory: boolean;
  wihtAssigned: boolean;
  idProject: IdEntity;
}
