import type IdEntity from '../../../../shared/core/objects/IdEntity';
import type None from '../../../../shared/core/objects/None';
import type CategoryCriteria from '../interfaces/CategoryCriteria';
import type Category from '../model/Category';
import type IdCategory from '../objects/IdCategory';
export default interface CategoryRepository {
    create(category: Category): Promise<None>;
    update(category: Category): Promise<None>;
    getByProjectIdAndId(categoryId: IdCategory, idProject: IdEntity): Promise<Category | None>;
    getByCriteria(criteria: CategoryCriteria): Promise<Category[]>;
    getManyByProjectIdAndIds(categoryIds: IdCategory[], idProject: IdEntity): Promise<Category[]>;
}
//# sourceMappingURL=CategoryRepository.d.ts.map