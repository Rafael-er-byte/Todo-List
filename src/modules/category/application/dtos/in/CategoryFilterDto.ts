import type { TypeSorting } from '../../types/TypeSorting.type';

export default interface CategoryFilterDto {
  idProject: string;
  limit: number;
  page: number;
  titleLike?: string;
  orderBy?: TypeSorting;
}
