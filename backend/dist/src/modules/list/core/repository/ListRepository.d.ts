import type List from "../model/List";
export default interface ListRepository {
    create(list: List): Promise<void>;
    update(list: List): Promise<void>;
    getById(listId: string): Promise<List | null>;
    getMany(listIds: string[]): Promise<List[]>;
    getByProjectId(projectId: string, page: number, limit: number): Promise<List[]>;
}
//# sourceMappingURL=ListRepository.d.ts.map