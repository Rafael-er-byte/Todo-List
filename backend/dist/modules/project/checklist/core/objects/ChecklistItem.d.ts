import Text from '../../../../shared/core/objects/Text';
import ValueObject from '../../../../shared/core/objects/ValueObject';
import type ChecklistItemParams from '../interfaces/ChecklistItemParams';
import ChecklistItemId from './ChecklistItemId';
export default class ChecklistItem extends ValueObject {
    private id;
    private title;
    private completed;
    private constructor();
    static create(title: Text): ChecklistItem;
    static fromPrimitives(params: ChecklistItemParams): ChecklistItem;
    getId(): ChecklistItemId;
    getTitle(): Text;
    getStatus(): boolean;
    complete(): ChecklistItem;
    markAsPending(): ChecklistItem;
    updateTitle(title: Text): ChecklistItem;
    isCompleted(): boolean;
    toPrimitives(): ChecklistItemParams;
}
//# sourceMappingURL=ChecklistItem.d.ts.map