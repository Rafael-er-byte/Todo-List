import { describe, expect, it } from 'vitest';
import List from '../../../../../src/modules/list/core/model/List';
import ListId from '../../../../../src/modules/list/core/object/ListId';
import ListTitle from '../../../../../src/modules/list/core/object/ListTitle';
import IdEntity from '../../../../../src/modules/shared/core/objects/IdEntity';
import InvalidParameters from '../../../../../src/modules/shared/core/errors/InvalidParameters';
import PositiveInteger from '../../../../../src/modules/shared/core/objects/PositiveInteger';
import Text from '../../../../../src/modules/shared/core/objects/Text';
const buildList = () => List.create(new ListId('0143c815-7220-7d64-8c42-6f2af4f9fd37'), new ListTitle(new Text('Backlog')), new PositiveInteger(1), [], new IdEntity('0343c815-7220-7d64-8c42-6f2af4f9fd37'));
describe('List', () => {
    it('creates a list with a positive integer position', () => {
        const list = buildList();
        expect(list.toPrimitives().position).toBe(1);
    });
    it('returns list information with getters', () => {
        const list = buildList();
        const tasks = list.getTasks();
        tasks.push({});
        expect(list.getTitle().getValue().getText()).toBe('Backlog');
        expect(list.getPosition().getValue()).toBe(1);
        expect(list.isArchived()).toBe(false);
        expect(list.getTasks()).toHaveLength(0);
    });
    it('moves a list with a positive integer position and emits event', () => {
        const list = buildList();
        const actor = new IdEntity('0443c815-7220-7d64-8c42-6f2af4f9fd37');
        list.move(new PositiveInteger(2), 'list-moved-key', actor);
        expect(list.toPrimitives().position).toBe(2);
        const events = list.pullEvents();
        expect(events).toHaveLength(1);
        expect(events[0].getEvent()).toBe('LIST_MOVED');
    });
    it('exports a list with a positive integer position and emits event', () => {
        const list = buildList();
        const actor = new IdEntity('0443c815-7220-7d64-8c42-6f2af4f9fd37');
        const newProject = new IdEntity('0543c815-7220-7d64-8c42-6f2af4f9fd37');
        list.export(newProject, new PositiveInteger(3), 'list-exported-key', actor);
        expect(list.toPrimitives().position).toBe(3);
        const events = list.pullEvents();
        expect(events).toHaveLength(1);
        expect(events[0].getEvent()).toBe('LIST_EXPORTED');
    });
    it('restores a list position as a positive integer from primitives', () => {
        const list = List.fromPrimitives({
            id: '0143c815-7220-7d64-8c42-6f2af4f9fd37',
            title: 'Backlog',
            position: 4,
            archived: false,
            tasks: [],
            projectId: '0343c815-7220-7d64-8c42-6f2af4f9fd37',
            version: 2,
            deletedAt: null,
        });
        expect(list.toPrimitives().position).toBe(4);
    });
    it('does not allow negative list positions', () => {
        expect(() => List.create(new ListId('0143c815-7220-7d64-8c42-6f2af4f9fd37'), new ListTitle(new Text('Backlog')), new PositiveInteger(-1), [], new IdEntity('0343c815-7220-7d64-8c42-6f2af4f9fd37'))).toThrow(InvalidParameters);
    });
    it('archives and unarchives a list with events', () => {
        const list = buildList();
        const actor = new IdEntity('0443c815-7220-7d64-8c42-6f2af4f9fd37');
        list.archive('list-archived-key', actor);
        expect(list.isArchived()).toBe(true);
        let events = list.pullEvents();
        expect(events).toHaveLength(1);
        expect(events[0].getEvent()).toBe('LIST_ARCHIVED');
        list.unarchive('list-unarchived-key', actor);
        expect(list.isArchived()).toBe(false);
        events = list.pullEvents();
        expect(events).toHaveLength(1);
        expect(events[0].getEvent()).toBe('LIST_UNARCHIVED');
    });
    it('deletes an archived list with event', () => {
        const list = buildList();
        const actor = new IdEntity('0443c815-7220-7d64-8c42-6f2af4f9fd37');
        list.archive('list-archived-key', actor);
        list.pullEvents();
        list.delete('list-deleted-key', actor);
        expect(list.exists()).toBe(false);
        const events = list.pullEvents();
        expect(events).toHaveLength(1);
        expect(events[0].getEvent()).toBe('LIST_DELETED');
    });
});
//# sourceMappingURL=List.test.js.map