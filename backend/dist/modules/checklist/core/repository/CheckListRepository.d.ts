import type CheckList from '../model/CheckList';
import type IdCheckList from '../objects/IdCheckList';
export default interface CheckListRepository {
    create(checkList: CheckList): Promise<void>;
    update(checkList: CheckList): Promise<void>;
    getById(checkListId: IdCheckList): Promise<CheckList | undefined>;
    getMany(page: number, limit: number): Promise<CheckList[]>;
}
//# sourceMappingURL=CheckListRepository.d.ts.map