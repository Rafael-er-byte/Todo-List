import ID from '../../../../shared/core/objects/ID';
import Text from '../../../../shared/core/objects/Text';
import ValueObject from '../../../../shared/core/objects/ValueObject';
import ChecklistItemId from './ChecklistItemId';
export default class ChecklistItem extends ValueObject {
    constructor(id, title, completed) {
        super();
        this.id = id;
        this.title = title;
        this.completed = completed;
    }
    static create(title) {
        const itemId = new ChecklistItemId(ID.generateId().toString());
        return new ChecklistItem(itemId, title, false);
    }
    static fromPrimitives(params) {
        return new ChecklistItem(new ChecklistItemId(params.id), new Text(params.title), params.isCompleted);
    }
    getId() {
        return this.id;
    }
    getTitle() {
        return this.title;
    }
    getStatus() {
        return this.completed;
    }
    complete() {
        return new ChecklistItem(this.id, this.title, true);
    }
    markAsPending() {
        return new ChecklistItem(this.id, this.title, false);
    }
    updateTitle(title) {
        return new ChecklistItem(this.id, title, this.completed);
    }
    isCompleted() {
        return this.completed;
    }
    toPrimitives() {
        return {
            id: this.id.toString(),
            title: this.title.getText(),
            isCompleted: this.completed,
        };
    }
}
//# sourceMappingURL=ChecklistItem.js.map