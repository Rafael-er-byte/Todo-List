import type Category from '../../core/model/Category';
import type CategoryFilterDto from '../../application/dtos/in/CategoryFilterDto';

export default interface iSearchRepository {
  create(category: Category): Promise<boolean>;
  update(category: Category): Promise<boolean>;
  delete(id: Category['idCategory']): Promise<boolean>;
  search(categoryFilterDto: CategoryFilterDto): Promise<Category[]>;
}
