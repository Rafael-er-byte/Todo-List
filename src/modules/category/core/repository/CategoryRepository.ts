import type IdEntity from '../../../shared/core/objects/IdEntity';
import type None from '../../../shared/core/objects/None';
import type CategoryCriteria from '../interfaces/CategoryCriteria';
import type Category from '../model/Category';
import type IdCategory from '../objects/IdCategory';

export default interface CategoryRepository {
  create(category: Category): Promise<None>;
  update(category: Category): Promise<None>;
  getById(projectId: IdEntity, categoryId: IdCategory): Promise<Category | None>;
  getByCriteria(projectId: IdEntity, criteria: CategoryCriteria): Promise<Category[]>;
  getManyByIds(projectId: IdEntity, categoryIds: IdCategory[]): Promise<Category[]>;
}
