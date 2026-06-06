import CheckList from '../../../../../src/modules/checklist/core/model/CheckList';
import IdCheckList from '../../../../../src/modules/checklist/core/objects/IdCheckList';
import CheckListName from '../../../../../src/modules/checklist/core/objects/CheckListName';
import Text from '../../../../../src/modules/shared/core/objects/Text';
import IdEntity from '../../../../../src/modules/shared/core/objects/IdEntity';
import ID from '../../../../../src/modules/shared/core/objects/ID';
import { describe, it, expect } from 'vitest';
describe('CheckList', () => {
    const owner = new IdEntity(ID.generateId().getId());
    const actor = new IdEntity(ID.generateId().getId());
    const key = 'event-key';
    it('creates a checklist and emits a CheckListCreated event', () => {
        const checklist = CheckList.create(new IdCheckList(ID.generateId().getId()), owner, new CheckListName('My checklist'), actor, key);
        const events = checklist.pullEvents();
        expect(checklist.getName().getName()).toBe('My checklist');
        expect(checklist.getCompletedPercentage().getValue()).toBe(0);
        expect(checklist.toPrimitives().idOwner).toBe(owner.getID());
        expect(events).toHaveLength(1);
        expect(events[0].getEvent()).toBe('CHECKLIST_CREATED');
    });
    it('adds an item and updates completed percentage', () => {
        const checklist = CheckList.create(new IdCheckList(ID.generateId().getId()), owner, new CheckListName('Tasks'), actor, key);
        checklist.pullEvents();
        checklist.addChecklistItem(new Text('Wash dishes'), actor, key);
        expect(checklist.getItems()).toHaveLength(1);
        expect(checklist.getCompletedPercentage().getValue()).toBe(0);
        const events = checklist.pullEvents();
        expect(events).toHaveLength(1);
        expect(events[0].getEvent()).toBe('CHECKLIST_ITEM_CREATED');
    });
    it('completes an item and emits ChecklistItemCompleted', () => {
        const checklist = CheckList.create(new IdCheckList(ID.generateId().getId()), owner, new CheckListName('Tasks'), actor, key);
        checklist.addChecklistItem(new Text('Write tests'), actor, key);
        const itemId = checklist.getItems()[0].getId().getID();
        checklist.pullEvents();
        checklist.completeChecklistItem(itemId, actor, key);
        expect(checklist.getCompletedPercentage().getValue()).toBe(100);
        const events = checklist.pullEvents();
        expect(events).toHaveLength(1);
        expect(events[0].getEvent()).toBe('CHECKLIST_ITEM_COMPLETED');
    });
    it('marks an item as pending and recalculates percentage', () => {
        const checklist = CheckList.create(new IdCheckList(ID.generateId().getId()), owner, new CheckListName('Tasks'), actor, key);
        checklist.addChecklistItem(new Text('Build feature'), actor, key);
        const itemId = checklist.getItems()[0].getId().getID();
        checklist.completeChecklistItem(itemId, actor, key);
        checklist.pullEvents();
        checklist.markChecklistItemAsPending(itemId, actor, key);
        expect(checklist.getCompletedPercentage().getValue()).toBe(0);
        const events = checklist.pullEvents();
        expect(events[0].getEvent()).toBe('CHECKLIST_ITEM_MARKED_AS_PENDING');
    });
    it('updates the checklist title and emits CheckListTitleUpdated', () => {
        const checklist = CheckList.create(new IdCheckList(ID.generateId().getId()), owner, new CheckListName('Initial'), actor, key);
        checklist.pullEvents();
        checklist.updateName(new CheckListName('Updated name'), actor, key);
        expect(checklist.getName().getName()).toBe('Updated name');
        const events = checklist.pullEvents();
        expect(events[0].getEvent()).toBe('CHECKLIST_TITLE_UPDATED');
    });
});
//# sourceMappingURL=CheckList.test.js.map