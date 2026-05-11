import type CategoryDto from '../dtos/in/CategoryDto';
import type iCategoryRepository from '../contracts/repository/iRepository';
import Category from '../../core/model/Category';
import Action from '../dtos/out/ActionDto';
import CoreError from '../../../shared/core/errors/CoreError';
import ResourceNotFoud from '../../../shared/core/errors/ResourceNotFound';
import MissingRequiredParameters from '../../../shared/core/errors/MissingRequiredParameters';
import OperationNotAllowed from '../../../shared/core/errors/OperationNotAllowed';

export default class UpdateCategory {
  constructor(private readonly repo: iCategoryRepository) {}

  async execute(categoryDto: CategoryDto): Promise<Action> {
    if (!categoryDto.idCategory)
      throw new MissingRequiredParameters('category id', categoryDto.idCategory);

    const category: Category | undefined = await this.repo.getById(categoryDto.idCategory);
    if (!category) throw new ResourceNotFoud('Category', categoryDto);
    if (category.getIdProject() !== categoryDto.idProject)
      throw new OperationNotAllowed('Not allowed');

    category.setIcon(categoryDto.icon);
    category.setName(categoryDto.name);

    const savedOnRepo: boolean = await this.repo.update(category);
    if (!savedOnRepo) throw new CoreError('Cannot update the category at the moment', categoryDto);

    const action: Action = new Action(true, categoryDto.idCategory);
    return action;
  }
}
