import type Category from '../../../core/model/Category';

export default interface TaskService {
  isCategoryInUse(id: Category['idCategory']): Promise<boolean>;
}
