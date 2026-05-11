import type CategoryFilterDto from '../dtos/in/CategoryFilterDto';
import type Category from '../../core/model/Category';
import type iCategoryRepository from '../contracts/repository/iRepository';
import ResponseCategoryDto from '../dtos/out/ResponseCategoryDto';
import InvalidParameters from '../../../shared/core/errors/InvalidParameters';
import { VALID_SORTS } from '../types/TypeSorting.type';

export default class GetCategories {
  constructor(private readonly repo: iCategoryRepository) {}

  async execute(categoryFilterDto: CategoryFilterDto): Promise<ResponseCategoryDto[]> {
    if (!categoryFilterDto.idProject)
      throw new InvalidParameters('Invalid id of creator', {
        idProject: categoryFilterDto.idProject,
      });
    if (categoryFilterDto.orderBy && !VALID_SORTS.includes(categoryFilterDto.orderBy))
      throw new InvalidParameters('Invalid sort-type', { sortType: categoryFilterDto.orderBy });
    let categories: Category[] = [];

    categories = await this.repo.getAll(categoryFilterDto);

    const categoriesResponse: ResponseCategoryDto[] = categories.map((c) => {
      const category: ResponseCategoryDto = new ResponseCategoryDto(
        c.getName(),
        c.getIdCategory(),
        c.getIcon() as string,
        c.getCreatedAt() as string,
      );
      return category;
    });

    return categoriesResponse;
  }
}
