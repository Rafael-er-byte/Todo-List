import ChecklistItem from '../../../../../src/modules/checklist/core/objects/ChecklistItem';
import Text from '../../../../../src/modules/shared/core/objects/Text';
import { describe, it, expect } from 'vitest';
describe('ChecklistItem', () => {
    it('creates a checklist item in pending state', () => {
        const title = new Text('Test item');
        const item = ChecklistItem.create(title);
        expect(item).toBeInstanceOf(ChecklistItem);
        expect(item.getTitle().getText()).toBe('Test item');
        expect(item.getStatus()).toBe(false);
    });
    it('marks an item as completed', () => {
        const title = new Text('Complete task');
        const item = ChecklistItem.create(title).complete();
        expect(item.getStatus()).toBe(true);
        expect(item.isCompleted()).toBe(true);
    });
    it('marks an item as pending after completion', () => {
        const title = new Text('Pending task');
        const item = ChecklistItem.create(title).complete().markAsPending();
        expect(item.getStatus()).toBe(false);
        expect(item.isCompleted()).toBe(false);
    });
    it('updates the title and keeps the same id', () => {
        const title = new Text('Original');
        const item = ChecklistItem.create(title);
        const updated = item.updateTitle(new Text('Updated'));
        expect(updated.getId().getID()).toBe(item.getId().getID());
        expect(updated.getTitle().getText()).toBe('Updated');
    });
});
//# sourceMappingURL=ChecklistItem.test.js.map