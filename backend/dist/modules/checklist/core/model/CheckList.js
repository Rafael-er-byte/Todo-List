import Entity from '../../../shared/core/model/Entity';
import DateTime from '../../../shared/core/objects/DateTime';
import IdEntity from '../../../shared/core/objects/IdEntity';
import Text from '../../../shared/core/objects/Text';
import ChecklistItem from '../objects/ChecklistItem';
import IdCheckList from '../objects/IdCheckList';
import CheckListCreated from '../events/CheckListCreated';
import CheckListDeleted from '../events/CheckListDeleted';
import CheckListTitleUpdated from '../events/CheckListTitleUpdated';
import ChecklistItemCreated from '../events/ChecklistItemCreated';
import ChecklistItemDeleted from '../events/ChecklistItemDeleted';
import ChecklistItemCompleted from '../events/ChecklistItemCompleted';
import ChecklistItemMarkedAsPending from '../events/ChecklistItemMarkedAsPending';
import ChecklistItemTitleUpdated from '../events/ChecklistItemTitleUpdated';
import ResourceNotFound from '../../../shared/core/errors/ResourceNotFound';
import PercentageCompleted from '../objects/PercentageCompleted';
import CheckListName from '../objects/CheckListName';
export default class CheckList extends Entity {
    constructor(id, task, name, items, completedPercentage) {
        super(id);
        this.items = [];
        this.task = task;
        this.name = name;
        this.items = items;
        this.completedPercentage = completedPercentage;
    }
    static create(params) {
        const id = new IdCheckList(params.id);
        const owner = new IdEntity(params.idOwner);
        const name = new CheckListName(params.name);
        const actor = new IdEntity(params.actor);
        const items = (params.items ?? []).map((item) => ChecklistItem.fromPrimitives(item));
        const checklist = new CheckList(id, owner, name, items, new PercentageCompleted(0));
        checklist.recalculateCompletedPercentage();
        checklist.addEvent(new CheckListCreated(params.key, DateTime.now(), actor, checklist.getTaskId(), id, checklist.toPrimitives()));
        return checklist;
    }
    static fromPrimitives(params) {
        const items = params.items.map((item) => ChecklistItem.fromPrimitives(item));
        const checklist = new CheckList(new IdCheckList(params.id), new IdEntity(params.idOwner), new CheckListName(params.name), items, new PercentageCompleted(params.completedPercentage));
        return checklist;
    }
    getName() {
        return this.name;
    }
    getItems() {
        return [...this.items];
    }
    getCompletedPercentage() {
        return this.completedPercentage;
    }
    getTaskId() {
        return this.task;
    }
    updateName(name, actor, key) {
        this.name = name;
        this.addEvent(new CheckListTitleUpdated(key, DateTime.now(), actor, this.getTaskId(), super.getID(), { name: name.getName() }));
    }
    addChecklistItem(title, actor, key) {
        const item = ChecklistItem.create(title);
        this.items = [...this.items, item];
        this.recalculateCompletedPercentage();
        this.addEvent(new ChecklistItemCreated(key, DateTime.now(), actor, this.getTaskId(), super.getID(), item.toPrimitives()));
    }
    deleteChecklistItem(itemId, actor, key) {
        const item = this.items.find((checklistItem) => checklistItem.getId().getID() === itemId);
        if (!item)
            throw new ResourceNotFound(`Checklist item ${itemId} not found`);
        this.items = this.items.filter((checklistItem) => checklistItem.getId().getID() !== itemId);
        this.recalculateCompletedPercentage();
        this.addEvent(new ChecklistItemDeleted(key, DateTime.now(), actor, this.getTaskId(), super.getID(), item.toPrimitives()));
    }
    completeChecklistItem(itemId, actor, key) {
        this.updateChecklistItemStatus(itemId, true, actor, key, ChecklistItemCompleted);
    }
    markChecklistItemAsPending(itemId, actor, key) {
        this.updateChecklistItemStatus(itemId, false, actor, key, ChecklistItemMarkedAsPending);
    }
    updateChecklistItemTitle(itemId, title, actor, key) {
        const item = this.items.find((checklistItem) => checklistItem.getId().getID() === itemId);
        if (!item)
            throw new ResourceNotFound(`Checklist item ${itemId} not found`);
        const updatedItem = item.updateTitle(title);
        this.items = this.items.map((checklistItem) => checklistItem.getId().getID() === itemId ? updatedItem : checklistItem);
        this.addEvent(new ChecklistItemTitleUpdated(key, DateTime.now(), actor, this.getTaskId(), super.getID(), {
            id: itemId,
            title: title.getText(),
        }));
    }
    delete(actor, key) {
        this.addEvent(new CheckListDeleted(key, DateTime.now(), actor, this.getTaskId(), super.getID()));
    }
    toPrimitives() {
        return {
            id: super.getID().getID(),
            idOwner: this.getTaskId().getID(),
            name: this.name.getName(),
            items: this.items.map((item) => item.toPrimitives()),
            completedPercentage: this.completedPercentage.toPrimitive(),
        };
    }
    updateChecklistItemStatus(itemId, isCompleted, actor, key, EventClass) {
        const item = this.items.find((checklistItem) => checklistItem.getId().getID() === itemId);
        if (!item)
            throw new ResourceNotFound(`Checklist item ${itemId} not found`);
        const updatedItem = isCompleted ? item.complete() : item.markAsPending();
        this.items = this.items.map((checklistItem) => checklistItem.getId().getID() === itemId ? updatedItem : checklistItem);
        this.recalculateCompletedPercentage();
        this.addEvent(new EventClass(key, DateTime.now(), actor, this.getTaskId(), super.getID(), updatedItem.toPrimitives()));
    }
    recalculateCompletedPercentage() {
        if (this.items.length === 0) {
            this.completedPercentage = new PercentageCompleted(0);
            return;
        }
        const completedCount = this.items.filter((item) => item.isCompleted()).length;
        const percent = (completedCount / this.items.length) * 100;
        this.completedPercentage = new PercentageCompleted(percent);
    }
}
//# sourceMappingURL=CheckList.js.map