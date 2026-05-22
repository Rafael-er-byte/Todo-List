import type iCategoryRepository from '../contracts/repository/iRepository';
import type TaskService from '../contracts/services/TaskService';
import Action from '../dtos/out/ActionDto';
export default class DeleteCategoryById {
    private readonly repo;
    private readonly taskService;
    constructor(repo: iCategoryRepository, taskService: TaskService);
    execute(id: string, idProject: string): Promise<Action>;
}
//# sourceMappingURL=DeleteCategory.service.d.ts.map