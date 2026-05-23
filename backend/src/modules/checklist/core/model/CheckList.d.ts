import Entity from '../../../shared/core/model/Entity';
import IdEntity from '../../../shared/core/objects/IdEntity';
import Text from '../../../shared/core/objects/Text';
import Decimal from '../../../shared/core/objects/Decimal';
import type CheckListParams from '../interfaces/CheckListParams';
import ChecklistItem from '../objects/ChecklistItem';
import IdCheckList from '../objects/IdCheckList';
export default class CheckList extends Entity {
    private name;
    private items;
    private completedPercentage;
    private constructor();
    static create(id: IdCheckList, owner: IdEntity, name: Text, actor: IdEntity, key: string, items?: ChecklistItem[]): CheckList;
    static fromPrimitives(params: CheckListParams): CheckList;
    getName(): Text;
    getItems(): ChecklistItem[];
    getCompletedPercentage(): Decimal;
    private getOwnerId;
    updateName(name: Text, actor: IdEntity, key: string): void;
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