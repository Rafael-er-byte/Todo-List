import Entity from '../../../shared/core/model/Entity';
import DateTime from '../../../shared/core/objects/DateTime';
import IdEntity from '../../../shared/core/objects/IdEntity';
import Text from '../../../shared/core/objects/Text';
import Version from '../../../shared/core/objects/Version';
import DeletedAt from '../../../shared/core/objects/DeletedAt';
import Decimal from '../../../shared/core/objects/Decimal';
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
export default class CheckList extends Entity {
    constructor(id, owner, name, items, completedPercentage) {
        super(id, owner);
        this.items = [];
        this.name = name;
        this.items = items;
        this.completedPercentage = completedPercentage;
    }
    static create(id, owner, name, actor, key, items = []) {
        const checklist = new CheckList(id, owner, name, items, new Decimal(0));
        checklist.create();
        checklist.recalculateCompletedPercentage();
        checklist.addEvent(new CheckListCreated(key, DateTime.now(), actor, checklist.getOwnerId(), id, checklist.toPrimitives()));
        return checklist;
    }
    static fromPrimitives(params) {
        const items = params.items.map((item) => ChecklistItem.fromPrimitives(item));
        const checklist = new CheckList(new IdCheckList(params.id), new IdEntity(params.idOwner), new Text(params.name), items, new Decimal(params.completedPercentage));
        checklist.build(new Version(params.version), DeletedAt.createFromPrimitive(params.deletedAt));
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
    getOwnerId() {
        return super.getOwner();
    }
    updateName(name, actor, key) {
        this.name = name;
        this.addEvent(new CheckListTitleUpdated(key, DateTime.now(), actor, this.getOwnerId(), super.getID(), { name: name.getText() }));
    }
    addChecklistItem(title, actor, key) {
        const item = ChecklistItem.create(title);
        this.items = [...this.items, item];
        this.recalculateCompletedPercentage();
        this.addEvent(new ChecklistItemCreated(key, DateTime.now(), actor, this.getOwnerId(), super.getID(), item.toPrimitives()));
    }
    deleteChecklistItem(itemId, actor, key) {
        const item = this.items.find((checklistItem) => checklistItem.getId().getID() === itemId);
        if (!item)
            throw new ResourceNotFound(`Checklist item ${itemId} not found`);
        this.items = this.items.filter((checklistItem) => checklistItem.getId().getID() !== itemId);
        this.recalculateCompletedPercentage();
        this.addEvent(new ChecklistItemDeleted(key, DateTime.now(), actor, this.getOwnerId(), super.getID(), item.toPrimitives()));
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
        this.addEvent(new ChecklistItemTitleUpdated(key, DateTime.now(), actor, this.getOwnerId(), super.getID(), {
            id: itemId,
            title: title.getText(),
        }));
    }
    delete(actor, key) {
        this.addEvent(new CheckListDeleted(key, DateTime.now(), actor, this.getOwnerId(), super.getID()));
        super.softDelete();
    }
    toPrimitives() {
        return {
            id: super.getID().getID(),
            idOwner: this.getOwnerId().getID(),
            name: this.name.getText(),
            items: this.items.map((item) => item.toPrimitives()),
            completedPercentage: this.completedPercentage.toPrimitive(),
            version: super.getVersion().valueOf(),
            deletedAt: super.getDeletedAt().toPrimitive(),
        };
    }
    updateChecklistItemStatus(itemId, isCompleted, actor, key, EventClass) {
        const item = this.items.find((checklistItem) => checklistItem.getId().getID() === itemId);
        if (!item)
            throw new ResourceNotFound(`Checklist item ${itemId} not found`);
        const updatedItem = isCompleted ? item.complete() : item.markAsPending();
        this.items = this.items.map((checklistItem) => checklistItem.getId().getID() === itemId ? updatedItem : checklistItem);
        this.recalculateCompletedPercentage();
        this.addEvent(new EventClass(key, DateTime.now(), actor, this.getOwnerId(), super.getID(), updatedItem.toPrimitives()));
    }
    recalculateCompletedPercentage() {
        if (this.items.length === 0) {
            this.completedPercentage = new Decimal(0);
            return;
        }
        const completedCount = this.items.filter((item) => item.isCompleted()).length;
        const percent = (completedCount / this.items.length) * 100;
        this.completedPercentage = new Decimal(percent);
    }
}
//# sourceMappingURL=CheckList.js.map