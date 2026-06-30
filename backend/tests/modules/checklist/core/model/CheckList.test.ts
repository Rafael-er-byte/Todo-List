import CheckList from '../../../../../src/modules/project/checklist/core/model/CheckList';
import CheckListName from '../../../../../src/modules/project/checklist/core/objects/CheckListName';
import Text from '../../../../../src/modules/shared/core/objects/Text';
import ID from '../../../../../src/modules/shared/core/objects/ID';
import { describe, it, expect } from 'vitest';
import type DomainEvent from '../../../../../src/modules/shared/core/events/DomainEvent';

describe('CheckList', () => {
  const owner = ID.generateId().toString();
  const actor = ID.generateId().toString();
  const key = 'event-key';

  it('creates a checklist and emits a CheckListCreated event', () => {
    const checklist = CheckList.create({ id: ID.generateId().toString(), idOwner: owner, name: 'My checklist', actor, key });
    const events = checklist.pullEvents();

    expect(checklist.getName().getName()).toBe('My checklist');
    expect(checklist.getCompletedPercentage().getValue()).toBe(0);
    expect(checklist.toPrimitives().idOwner).toBe(owner);
    expect(events).toHaveLength(1);
    expect((events[0] as DomainEvent).getEvent()).toBe('CHECKLIST_CREATED');
  });

  it('adds an item and updates completed percentage', () => {
    const checklist = CheckList.create({ id: ID.generateId().toString(), idOwner: owner, name: 'Tasks', actor, key });
    checklist.pullEvents();

    checklist.addChecklistItem(new Text('Wash dishes'), actor, key);
    expect(checklist.getItems()).toHaveLength(1);
    expect(checklist.getCompletedPercentage().getValue()).toBe(0);

    const events = checklist.pullEvents();
    expect(events).toHaveLength(1);
    expect((events[0] as DomainEvent).getEvent()).toBe('CHECKLIST_ITEM_CREATED');
  });

  it('completes an item and emits ChecklistItemCompleted', () => {
    const checklist = CheckList.create({ id: ID.generateId().toString(), idOwner: owner, name: 'Tasks', actor, key });
    checklist.addChecklistItem(new Text('Write tests'), actor, key);
    const itemId = checklist.getItems()[0]!.getId().getID();
    checklist.pullEvents();

    checklist.completeChecklistItem(itemId, actor, key);
    expect(checklist.getCompletedPercentage().getValue()).toBe(100);

    const events = checklist.pullEvents();
    expect(events).toHaveLength(1);
    expect((events[0] as DomainEvent).getEvent()).toBe('CHECKLIST_ITEM_COMPLETED');
  });

  it('marks an item as pending and recalculates percentage', () => {
    const checklist = CheckList.create({ id: ID.generateId().toString(), idOwner: owner, name: 'Tasks', actor, key });
    checklist.addChecklistItem(new Text('Build feature'), actor, key);
    const itemId = checklist.getItems()[0]!.getId().getID();
    checklist.completeChecklistItem(itemId, actor, key);
    checklist.pullEvents();

    checklist.markChecklistItemAsPending(itemId, actor, key);
    expect(checklist.getCompletedPercentage().getValue()).toBe(0);
    const events = checklist.pullEvents();
    expect((events[0] as DomainEvent).getEvent()).toBe('CHECKLIST_ITEM_MARKED_AS_PENDING');
  });

  it('updates the checklist title and emits CheckListTitleUpdated', () => {
    const checklist = CheckList.create({ id: ID.generateId().toString(), idOwner: owner, name: 'Initial', actor, key });
    checklist.pullEvents();

    checklist.updateName(new CheckListName('Updated name'), actor, key);
    expect(checklist.getName().getName()).toBe('Updated name');
    const events = checklist.pullEvents();
    expect((events[0] as DomainEvent).getEvent()).toBe('CHECKLIST_TITLE_UPDATED');
  });
});
