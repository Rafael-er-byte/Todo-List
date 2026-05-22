import type CategoryFilterDto from '../dtos/in/CategoryFilterDto';
import type iCategoryRepository from '../contracts/repository/iRepository';
import ResponseCategoryDto from '../dtos/out/ResponseCategoryDto';
export default class GetCategories {
    private readonly repo;
    constructor(repo: iCategoryRepository);
    execute(categoryFilterDto: CategoryFilterDto): Promise<ResponseCategoryDto[]>;
}
//# sourceMappingURL=GetCategories.service.d.ts.map