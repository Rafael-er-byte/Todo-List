export default class ResponseCategoryDto {
  name!: string;
  idCategory!: string;
  icon?: string;
  createdAt?: string | undefined;

  constructor(name: string, idCategory: string, icon: string, createdAt?: string) {
    this.name = name;
    this.idCategory = idCategory;
    this.icon = icon;
    this.createdAt = createdAt;
  }
}
