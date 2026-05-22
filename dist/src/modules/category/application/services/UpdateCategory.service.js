import Category from '../../core/model/Category';
import Action from '../dtos/out/ActionDto';
import CoreError from '../../../shared/core/errors/CoreError';
import ResourceNotFoud from '../../../shared/core/errors/ResourceNotFound';
import MissingRequiredParameters from '../../../shared/core/errors/MissingRequiredParameters';
import OperationNotAllowed from '../../../shared/core/errors/OperationNotAllowed';
export default class UpdateCategory {
    constructor(repo) {
        this.repo = repo;
    }
    async execute(categoryDto) {
        if (!categoryDto.idCategory)
            throw new MissingRequiredParameters('category id', categoryDto.idCategory);
        const category = await this.repo.getById(categoryDto.idCategory);
        if (!category)
            throw new ResourceNotFoud('Category', categoryDto);
        if (category.getIdProject() !== categoryDto.idProject)
            throw new OperationNotAllowed('Not allowed');
        category.setIcon(categoryDto.icon);
        category.setName(categoryDto.name);
        const savedOnRepo = await this.repo.update(category);
        if (!savedOnRepo)
            throw new CoreError('Cannot update the category at the moment', categoryDto);
        const action = new Action(true, categoryDto.idCategory);
        return action;
    }
}
//# sourceMappingURL=UpdateCategory.service.js.map