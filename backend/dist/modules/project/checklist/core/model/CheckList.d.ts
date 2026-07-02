import Entity from '../../../../shared/core/model/Entity';
import IdEntity from '../../../../shared/core/objects/IdEntity';
import Text from '../../../../shared/core/objects/Text';
import type CheckListParams from '../interfaces/CheckListParams';
import ChecklistItem from '../objects/ChecklistItem';
import PercentageCompleted from '../objects/PercentageCompleted';
import CheckListName from '../objects/CheckListName';
export default class CheckList extends Entity {
    private task;
    private name;
    private items;
    private completedPercentage;
    private constructor();
    static create(params: Pick<CheckListParams, 'id' | 'idOwner' | 'name'> & {
        actor: string;
        key: string;
        items?: CheckListParams['items'];
    }): CheckList;
    static fromPrimitives(params: CheckListParams): CheckList;
    getName(): CheckListName;
    getItems(): ChecklistItem[];
    getCompletedPercentage(): PercentageCompleted;
    private getTaskId;
    updateName(name: CheckListName, actor: IdEntity, key: string): void;
    addChecklistItem(title: Text, actor: IdEntity, key: string): void;
    deleteChecklistItem(itemId: string, actor: IdEntity, key: string): void;
    completeChecklistItem(itemId: string, actor: IdEntity, key: string): void;
    markChecklistItemAsPending(itemId: string, actor: IdEntity, key: string): void;
    updateChecklistItemTitle(itemId: string, title: Text, actor: IdEntity, key: string): void;
    delete(actor: IdEntity, key: string): void;
    toPrimitives(): CheckListParams;
    private updateChecklistItemStatus;
    private recalculateCompletedPercentage;
}
//# sourceMappingURL=CheckList.d.ts.map