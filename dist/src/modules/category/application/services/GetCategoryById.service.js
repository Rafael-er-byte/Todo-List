import InvalidParameters from '../../../shared/core/errors/InvalidParameters';
import OperationNotAllowed from '../../../shared/core/errors/OperationNotAllowed';
import ResourceNotFoud from '../../../shared/core/errors/ResourceNotFound';
import Category from '../../core/model/Category';
import ResponseCategoryDto from '../dtos/out/ResponseCategoryDto';
export default class GetCategoryById {
    constructor(repo) {
        this.repo = repo;
    }
    async execute(id, idCreator) {
        if (!id && !idCreator)
            throw new InvalidParameters('Invalid id of creator or id of category', {
                idProject: id,
                idCreator: idCreator,
            });
        const category = await this.repo.getById(id);
        if (!category)
            throw new ResourceNotFoud('Category doesnt exists', id);
        if (category.getIdProject() !== idCreator)
            throw new OperationNotAllowed('Not allowed');
        const response = new ResponseCategoryDto(category.getName(), category.getIdProject(), category.getCreatedAt(), category.getIcon());
        return response;
    }
}
//# sourceMappingURL=GetCategoryById.service.js.map