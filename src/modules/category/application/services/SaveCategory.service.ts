import type CategoryDto from '../dtos/in/CategoryDto';
import Category from '../../core/model/Category';
import Action from '../dtos/out/ActionDto';
import type iCategoryRepository from '../contracts/repository/iRepository';
import type IDManager from '../../../contracts/utils/IDManager';
import type DateManager from '../../../contracts/utils/DateManager';
import CoreError from '../../../shared/core/errors/CoreError';
import MissingRequiredParameters from '../../../shared/core/errors/MissingRequiredParameters';

export default class SaveCategory {
  constructor(
    private readonly repo: iCategoryRepository,
    private readonly idManager: IDManager,
    private readonly dateManager: DateManager,
  ) {}

  async execute(categoryDto: CategoryDto): Promise<Action> {
    if (!categoryDto.idProject)
      throw new MissingRequiredParameters('Invalid id of creator ', {
        idProject: categoryDto.idProject,
      });
    const category: Category = new Category(
      categoryDto.name,
      categoryDto.idProject,
      this.idManager.generateId(),
      categoryDto.icon,
      this.dateManager.generate(),
    );

    const savedOnRepo: boolean = await this.repo.create(category);

    if (!savedOnRepo) throw new CoreError('Cannot create the category at the moment', categoryDto);

    const action: Action = new Action(true, category.getIdCategory());
    return action;
  }
}
