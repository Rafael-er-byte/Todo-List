import CoreError from '../../../shared/core/errors/CoreError';
import InvalidParameters from '../../../shared/core/errors/InvalidParameters';
import OperationNotAllowed from '../../../shared/core/errors/OperationNotAllowed';
import ResourceNotFoud from '../../../shared/core/errors/ResourceNotFound';
import Action from '../dtos/out/ActionDto';
export default class DeleteCategoryById {
    constructor(repo, taskService) {
        this.repo = repo;
        this.taskService = taskService;
    }
    async execute(id, idProject) {
        if (!idProject || !id)
            throw new InvalidParameters('Invalid id of creator or id of category', {
                idProject: idProject,
                id: id,
            });
        if (await this.taskService.isCategoryInUse(id))
            throw new OperationNotAllowed('The category is currently in use');
        const category = await this.repo.getById(id);
        if (!category)
            throw new ResourceNotFoud('Category', { idProject: idProject, id: id });
        if (category.getIdProject() !== idProject)
            throw new OperationNotAllowed('Not allowed');
        const deleted = await this.repo.delete(id);
        if (!deleted)
            throw new CoreError('Cannot delete the category at the moment', {
                id: id,
                idProject: idProject,
            });
        const action = new Action(true, id);
        return action;
    }
}
//# sourceMappingURL=DeleteCategory.service.js.map