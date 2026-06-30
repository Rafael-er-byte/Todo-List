import { describe, expect, it } from 'vitest';
import List from '../../../../../src/modules/project/list/core/model/List';
import ListId from '../../../../../src/modules/project/list/core/object/ListId';
import ListTitle from '../../../../../src/modules/project/list/core/object/ListTitle';
import TaskList from '../../../../../src/modules/project/list/core/object/TaskList';
import IdEntity from '../../../../../src/modules/shared/core/objects/IdEntity';
import InvalidParameters from '../../../../../src/modules/shared/core/errors/InvalidParameters';
import PositiveInteger from '../../../../../src/modules/shared/core/objects/PositiveInteger';
import Text from '../../../../../src/modules/shared/core/objects/Text';

const buildList = () => List.create(
  {
    id: '0143c815-7220-7d64-8c42-6f2af4f9fd37',
    title: 'Backlog',
    position: 1,
    tasks: [],
    projectId: '0343c815-7220-7d64-8c42-6f2af4f9fd37',
  },
);

const buildTask = (position: number, id: string, projectId: string = '0343c815-7220-7d64-8c42-6f2af4f9fd37') =>
  new TaskList(new IdEntity(id), new PositiveInteger(position), new IdEntity(projectId));

describe('List', () => {
  it('creates a list with a positive integer position', () => {
    const list = buildList();

    expect(list.toPrimitives().position).toBe(1);
  });

  it('returns list information with getters', () => {
    const list = buildList();
    const tasks = list.getTasks();
    tasks.push({} as TaskList);

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
    expect(events[0]!.getEvent()).toBe('LIST_MOVED');
  });

  it('exports a list with a positive integer position and emits event', () => {
    const list = buildList();
    const actor = new IdEntity('0443c815-7220-7d64-8c42-6f2af4f9fd37');
    const newProject = new IdEntity('0543c815-7220-7d64-8c42-6f2af4f9fd37');

    list.export(newProject, new PositiveInteger(3), 'list-exported-key', actor);

    expect(list.toPrimitives().position).toBe(3);
    const events = list.pullEvents();
    expect(events).toHaveLength(1);
    expect(events[0]!.getEvent()).toBe('LIST_EXPORTED');
  });

  it('restores a list position as a positive integer from primitives', () => {
    const list = List.fromPrimitives({
      id: '0143c815-7220-7d64-8c42-6f2af4f9fd37',
      title: 'Backlog',
      position: 4,
      archived: false,
      tasks: [],
      projectId: '0343c815-7220-7d64-8c42-6f2af4f9fd37',
    });

    expect(list.toPrimitives().position).toBe(4);
  });

  it('does not allow negative list positions', () => {
    expect(() => List.create(
      {
        id: '0143c815-7220-7d64-8c42-6f2af4f9fd37',
        title: 'Backlog',
        position: -1,
        tasks: [],
        projectId: '0343c815-7220-7d64-8c42-6f2af4f9fd37',
      },
    )).toThrow(InvalidParameters);
  });

  it('does not allow zero list positions', () => {
    expect(() => List.create(
      {
        id: '0143c815-7220-7d64-8c42-6f2af4f9fd37',
        title: 'Backlog',
        position: 0,
        tasks: [],
        projectId: '0343c815-7220-7d64-8c42-6f2af4f9fd37',
      },
    )).toThrow(InvalidParameters);
  });

  it('inserts tasks at correct 1-based positions and shifts later tasks', () => {
    const list = buildList();
    const firstTask = buildTask(1, '0243c815-7220-7d64-8c42-6f2af4f9fd37');
    const secondTask = buildTask(2, '0343c815-7220-7d64-8c42-6f2af4f9fd37');
    const insertedTask = buildTask(1, '0443c815-7220-7d64-8c42-6f2af4f9fd37');

    list.addTask(firstTask);
    list.addTask(secondTask);
    list.addTask(insertedTask);

    const tasks = list.getTasks();
    expect(tasks.map((task) => task.id.getID())).toEqual([
      insertedTask.id.getID(),
      firstTask.id.getID(),
      secondTask.id.getID(),
    ]);
    expect(tasks.map((task) => task.position.getValue())).toEqual([1, 2, 3]);
  });

  it('removes a task and reorders subsequent tasks', () => {
    const list = buildList();
    const firstTask = buildTask(1, '0243c815-7220-7d64-8c42-6f2af4f9fd37');
    const secondTask = buildTask(2, '0343c815-7220-7d64-8c42-6f2af4f9fd37');
    const thirdTask = buildTask(3, '0443c815-7220-7d64-8c42-6f2af4f9fd37');

    list.addTask(firstTask);
    list.addTask(secondTask);
    list.addTask(thirdTask);

    list.removeTask(secondTask);

    const tasks = list.getTasks();
    expect(tasks.map((task) => task.id.getID())).toEqual([
      firstTask.id.getID(),
      thirdTask.id.getID(),
    ]);
    expect(tasks.map((task) => task.position.getValue())).toEqual([1, 2]);
  });

  it('archives and unarchives a list with events', () => {
    const list = buildList();
    const actor = new IdEntity('0443c815-7220-7d64-8c42-6f2af4f9fd37');

    list.archive('list-archived-key', actor);

    expect(list.isArchived()).toBe(true);
    let events = list.pullEvents();
    expect(events).toHaveLength(1);
    expect(events[0]!.getEvent()).toBe('LIST_ARCHIVED');

    list.unarchive('list-unarchived-key', actor);

    expect(list.isArchived()).toBe(false);
    events = list.pullEvents();
    expect(events).toHaveLength(1);
    expect(events[0]!.getEvent()).toBe('LIST_UNARCHIVED');
  });

  it('deletes an archived list with event', () => {
    const list = buildList();
    const actor = new IdEntity('0443c815-7220-7d64-8c42-6f2af4f9fd37');

    list.archive('list-archived-key', actor);
    list.pullEvents();

    list.delete('list-deleted-key', actor);

    const events = list.pullEvents();
    expect(events).toHaveLength(1);
    expect(events[0]!.getEvent()).toBe('LIST_DELETED');
  });
});
