import type CategoryDto from '../dtos/in/CategoryDto';
import Action from '../dtos/out/ActionDto';
import type iCategoryRepository from '../contracts/repository/iRepository';
import type IDManager from '../../../contracts/utils/IDManager';
import type DateManager from '../../../contracts/utils/DateManager';
export default class SaveCategory {
    private readonly repo;
    private readonly idManager;
    private readonly dateManager;
    constructor(repo: iCategoryRepository, idManager: IDManager, dateManager: DateManager);
    execute(categoryDto: CategoryDto): Promise<Action>;
}
//# sourceMappingURL=SaveCategory.service.d.ts.map