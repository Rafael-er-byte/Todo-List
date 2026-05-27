import { describe, expect, it } from 'vitest';
import List from '../../../../../src/modules/list/core/model/List';
import ListId from '../../../../../src/modules/list/core/object/ListId';
import ListTitle from '../../../../../src/modules/list/core/object/ListTitle';
import Task from '../../../../../src/modules/task/core/model/Task';
import TaskId from '../../../../../src/modules/task/core/objects/TaskId';
import TaskState from '../../../../../src/modules/task/core/objects/TaskState';
import TaskTitle from '../../../../../src/modules/task/core/objects/TaskTitle';
import Collection from '../../../../../src/modules/shared/core/objects/Collection';
import IdEntity from '../../../../../src/modules/shared/core/objects/IdEntity';
import IntNumber from '../../../../../src/modules/shared/core/objects/IntNumber';
import None from '../../../../../src/modules/shared/core/objects/None';
import Text from '../../../../../src/modules/shared/core/objects/Text';
import InvalidOperation from '../../../../../src/modules/shared/core/errors/InvalidOperation';
const projectId = new IdEntity('0343c815-7220-7d64-8c42-6f2af4f9fd37');
const actor = new IdEntity('0443c815-7220-7d64-8c42-6f2af4f9fd37');
const buildTask = (id, position) => {
    const task = Task.create(new TaskTitle(`Task ${position}`), new IdEntity('0143c815-7220-7d64-8c42-6f2af4f9fd37'), new IntNumber(position), TaskState.pending(), false, new TaskId(id), projectId, new None(), new None(), new None(), new Collection([], [], []), new Collection([], [], []), actor, `task-created-${position}`);
    task.pullEvents();
    return task;
};
const buildList = (tasks = []) => List.create(new ListId('0143c815-7220-7d64-8c42-6f2af4f9fd37'), new ListTitle(new Text('Backlog')), new IntNumber(1), tasks, projectId);
describe('List', () => {
    it('creates a list with archived primitives and getters', () => {
        const task = buildTask('0243c815-7220-7d64-8c42-6f2af4f9fd37', 0);
        const list = buildList([task]);
        const tasksCopy = list.getTasks();
        tasksCopy.push(buildTask('0543c815-7220-7d64-8c42-6f2af4f9fd37', 1));
        expect(list.getTitle().getValue().getText()).toBe('Backlog');
        expect(list.getPosition().getValue()).toBe(1);
        expect(list.getTasks()).toHaveLength(1);
        expect(list.toPrimitives()).toMatchObject({
            id: '0143c815-7220-7d64-8c42-6f2af4f9fd37',
            title: 'Backlog',
            position: 1,
            archived: false,
            projectId: '0343c815-7220-7d64-8c42-6f2af4f9fd37',
        });
    });
    it('archives and unarchives a list with events and updates tasks by other', () => {
        const task = buildTask('0243c815-7220-7d64-8c42-6f2af4f9fd37', 0);
        const list = buildList([task]);
        list.archive('list-archived-key', actor);
        expect(list.toPrimitives().archived).toBe(true);
        expect(task.toPrimitives().listArchived).toBe(true);
        let events = list.pullEvents();
        expect(events).toHaveLength(1);
        expect(events[0].getEvent()).toBe('LIST_ARCHIVED');
        list.unarchive('list-unarchived-key', actor);
        expect(list.toPrimitives().archived).toBe(false);
        expect(task.toPrimitives().listArchived).toBe(false);
        events = list.pullEvents();
        expect(events).toHaveLength(1);
        expect(events[0].getEvent()).toBe('LIST_UNARCHIVED');
    });
    it('deletes an archived list with event and deletes tasks by other', () => {
        const task = buildTask('0243c815-7220-7d64-8c42-6f2af4f9fd37', 0);
        const list = buildList([task]);
        list.archive('list-archived-key', actor);
        list.pullEvents();
        list.delete('list-deleted-key', actor);
        expect(list.exists()).toBe(false);
        expect(task.exists()).toBe(false);
        const events = list.pullEvents();
        expect(events).toHaveLength(1);
        expect(events[0].getEvent()).toBe('LIST_DELETED');
    });
    it('does not delete an active list', () => {
        const list = buildList();
        expect(() => list.delete('list-deleted-key', actor)).toThrow(InvalidOperation);
    });
    it('restores archived state from primitives', () => {
        const task = buildTask('0243c815-7220-7d64-8c42-6f2af4f9fd37', 0);
        const list = List.fromPrimitives({
            id: '0143c815-7220-7d64-8c42-6f2af4f9fd37',
            title: 'Backlog',
            position: 1,
            archived: true,
            tasks: [task],
            projectId: '0343c815-7220-7d64-8c42-6f2af4f9fd37',
            version: 3,
            deletedAt: null,
        });
        expect(list.toPrimitives().archived).toBe(true);
        expect(list.getTasks()).toEqual([task]);
        expect(list.getVersion().valueOf()).toBe(3);
    });
});
//# sourceMappingURL=List.test.js.map