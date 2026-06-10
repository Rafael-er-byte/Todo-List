import type DomainEvent from '../../../shared/core/events/DomainEvent';
import type None from '../../../shared/core/objects/None';
import type TaskCriteria from '../interface/TaskCriteria';
import type Task from '../model/Task';
import type TaskId from '../objects/TaskId';
export default interface TaskRepository {
    create(task: Task): Promise<void>;
    update(task: Task): Promise<void>;
    getById(taskId: TaskId): Promise<Task | None>;
    getByCriteria(criteria: TaskCriteria): Promise<Task[]>;
    getMany(taskIds: TaskId[]): Promise<Task[]>;
    updateMany(tasks: Task[]): Promise<void>;
    getCategoriesFromTaskById(taskId: TaskId, limit: number, page: number): Promise<string[]>;
    getAssignedFromTaskById(taskId: TaskId, limit: number, page: number): Promise<string[]>;
    getTaskLog(taskId: TaskId, limit: number, page: number): Promise<DomainEvent[]>;
}
//# sourceMappingURL=TaskRepository.d.ts.map