import type IdEntity from '../../../shared/core/objects/IdEntity';
import type None from '../../../shared/core/objects/None';
import type TaskCriteria from '../interface/TaskCriteria';
import type Task from '../model/Task';
import type TaskId from '../objects/TaskId';

export default interface iTaskRepository {
  create(task: Task): Promise<void>;
  update(task: Task): Promise<void>;
  getById(projectId: IdEntity, taskId: TaskId): Promise<Task | None>;
  getByCriteria(projectId: IdEntity, criteria: TaskCriteria): Promise<Task[]>;
  getManyByIds(projectId: IdEntity, taskIds: TaskId[]): Promise<Task[]>;
  updateManyByIds(projectId: IdEntity, tasks: Task[]): Promise<void>;
  getCategoriesFromTaskById(projectId: IdEntity, taskId: TaskId, limit: number, page: number): Promise<IdEntity[]>;
  getAssignedFromTaskById(projectId: IdEntity, taskId: TaskId, limit: number, page: number): Promise<IdEntity[]>;
}
