import Category from '../../core/model/Category';
import Action from '../dtos/out/ActionDto';
import CoreError from '../../../shared/core/errors/CoreError';
import MissingRequiredParameters from '../../../shared/core/errors/MissingRequiredParameters';
export default class SaveCategory {
    constructor(repo, idManager, dateManager) {
        this.repo = repo;
        this.idManager = idManager;
        this.dateManager = dateManager;
    }
    async execute(categoryDto) {
        if (!categoryDto.idProject)
            throw new MissingRequiredParameters('Invalid id of creator ', {
                idProject: categoryDto.idProject,
            });
        const category = new Category(categoryDto.name, categoryDto.idProject, this.idManager.generateId(), categoryDto.icon, this.dateManager.generate());
        const savedOnRepo = await this.repo.create(category);
        if (!savedOnRepo)
            throw new CoreError('Cannot create the category at the moment', categoryDto);
        const action = new Action(true, category.getIdCategory());
        return action;
    }
}
//# sourceMappingURL=SaveCategory.service.js.map