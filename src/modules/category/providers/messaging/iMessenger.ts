import type Category from '../../core/model/Category';

export default interface iMessenger {
  saveCategoryLater(category: Category): Promise<boolean>;
  updateCategoryLater(category: Category): Promise<boolean>;
  deleteCategoryLater(id: Category['idCategory']): Promise<boolean>;
}
