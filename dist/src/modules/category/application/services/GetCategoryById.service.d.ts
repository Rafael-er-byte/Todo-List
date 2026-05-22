import type iCategoryRepository from '../contracts/repository/iRepository';
import ResponseCategoryDto from '../dtos/out/ResponseCategoryDto';
export default class GetCategoryById {
    private readonly repo;
    constructor(repo: iCategoryRepository);
    execute(id: string, idCreator: string): Promise<ResponseCategoryDto>;
}
//# sourceMappingURL=GetCategoryById.service.d.ts.map