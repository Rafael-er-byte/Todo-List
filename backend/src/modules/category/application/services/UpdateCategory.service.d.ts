import type CategoryDto from '../dtos/in/CategoryDto';
import type iCategoryRepository from '../contracts/repository/iRepository';
import Action from '../dtos/out/ActionDto';
export default class UpdateCategory {
    private readonly repo;
    constructor(repo: iCategoryRepository);
    execute(categoryDto: CategoryDto): Promise<Action>;
}
//# sourceMappingURL=UpdateCategory.service.d.ts.map