import ResponseCategoryDto from '../dtos/out/ResponseCategoryDto';
import InvalidParameters from '../../../shared/core/errors/InvalidParameters';
import { VALID_SORTS } from '../types/TypeSorting.type';
export default class GetCategories {
    constructor(repo) {
        this.repo = repo;
    }
    async execute(categoryFilterDto) {
        if (!categoryFilterDto.idProject)
            throw new InvalidParameters('Invalid id of creator', {
                idProject: categoryFilterDto.idProject,
            });
        if (categoryFilterDto.orderBy && !VALID_SORTS.includes(categoryFilterDto.orderBy))
            throw new InvalidParameters('Invalid sort-type', { sortType: categoryFilterDto.orderBy });
        let categories = [];
        categories = await this.repo.getAll(categoryFilterDto);
        const categoriesResponse = categories.map((c) => {
            const category = new ResponseCategoryDto(c.getName(), c.getIdCategory(), c.getIcon(), c.getCreatedAt());
            return category;
        });
        return categoriesResponse;
    }
}
//# sourceMappingURL=GetCategories.service.js.map