import type None from '../../../shared/core/objects/None';
import type CategoryCriteria from '../interfaces/CategoryCriteria';
import type Category from '../model/Category';
import type IdCategory from '../objects/IdCategory';
export default interface CategoryRepository {
    create(category: Category): Promise<None>;
    update(category: Category): Promise<None>;
    getById(categoryId: IdCategory): Promise<Category | None>;
    getByCriteria(criteria: CategoryCriteria): Promise<Category[]>;
    getManyByIds(categoryIds: IdCategory[]): Promise<Category[]>;
}
//# sourceMappingURL=CategoryRepository.d.ts.map