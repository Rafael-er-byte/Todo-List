import { describe, expect, it } from 'vitest';
import List from '../../../../../src/modules/list/core/model/List';
import ListId from '../../../../../src/modules/list/core/object/ListId';
import ListTitle from '../../../../../src/modules/list/core/object/ListTitle';
import Task from '../../../../../src/modules/task/core/model/Task';
import TaskTitle from '../../../../../src/modules/task/core/objects/TaskTitle';
import TaskState from '../../../../../src/modules/task/core/objects/TaskState';
import TaskId from '../../../../../src/modules/task/core/objects/TaskId';
import IdEntity from '../../../../../src/modules/shared/core/objects/IdEntity';
import InvalidPositionInList from '../../../../../src/modules/list/core/errors/InvalidPositionInList';
import PositiveInteger from '../../../../../src/modules/shared/core/objects/PositiveInteger';
import Text from '../../../../../src/modules/shared/core/objects/Text';
import None from '../../../../../src/modules/shared/core/objects/None';
import Collection from '../../../../../src/modules/shared/core/objects/Collection';

const buildTask = (
  listId: string,
  projectId: string,
  positionInList: number,
  taskId: string,
) => {
  const title = new TaskTitle('Task title');
  const listContainer = new IdEntity(listId);
  const state = TaskState.pending();
  const projectOwner = new IdEntity(projectId);
  const actor = new IdEntity('0443c815-7220-7d64-8c42-6f2af4f9fd37');
  const categories = new Collection([], [], []);
  const assigned = new Collection([], [], []);

  return Task.create(
    title,
    listContainer,
    new PositiveInteger(positionInList),
    state,
    false,
    new TaskId(taskId),
    projectOwner,
    new None(),
    new None(),
    new None(),
    categories,
    assigned,
    actor,
    `task-created-${taskId}`,
  );
};

const buildList = () =>
  List.create(
    new ListId('0143c815-7220-7d64-8c42-6f2af4f9fd37'),
    new ListTitle(new Text('Backlog')),
    new PositiveInteger(1),
    [],
    new IdEntity('0343c815-7220-7d64-8c42-6f2af4f9fd37'),
  );

describe('List with tasks', () => {
  it('does not allow adding a task with an invalid position', () => {
    const list = buildList();
    const task = buildTask(
      '0143c815-7220-7d64-8c42-6f2af4f9fd37',
      '0343c815-7220-7d64-8c42-6f2af4f9fd37',
      2,
      '0243c815-7220-7d64-8c42-6f2af4f9fd37',
    );

    expect(() => list.addTask(task)).toThrow(InvalidPositionInList);
  });

  it('inserts and shifts tasks in a 1-based position list', () => {
    const list = buildList();
    const firstTask = buildTask(
      '0143c815-7220-7d64-8c42-6f2af4f9fd37',
      '0343c815-7220-7d64-8c42-6f2af4f9fd37',
      1,
      '0243c815-7220-7d64-8c42-6f2af4f9fd37',
    );
    const secondTask = buildTask(
      '0143c815-7220-7d64-8c42-6f2af4f9fd37',
      '0343c815-7220-7d64-8c42-6f2af4f9fd37',
      2,
      '0343c815-7220-7d64-8c42-6f2af4f9fd37',
    );
    const insertedTask = buildTask(
      '0143c815-7220-7d64-8c42-6f2af4f9fd37',
      '0343c815-7220-7d64-8c42-6f2af4f9fd37',
      1,
      '0443c815-7220-7d64-8c42-6f2af4f9fd37',
    );

    list.addTask(firstTask);
    list.addTask(secondTask);
    list.addTask(insertedTask);

    const tasks = list.getTasks();
    expect(tasks.map((task) => task.getID().getID())).toEqual([
      insertedTask.getID().getID(),
      firstTask.getID().getID(),
      secondTask.getID().getID(),
    ]);
    expect(tasks.map((task) => task.getPositionInList().getValue())).toEqual([1, 2, 3]);
  });

  it('removes a task and updates later task positions', () => {
    const list = buildList();
    const firstTask = buildTask(
      '0143c815-7220-7d64-8c42-6f2af4f9fd37',
      '0343c815-7220-7d64-8c42-6f2af4f9fd37',
      1,
      '0243c815-7220-7d64-8c42-6f2af4f9fd37',
    );
    const secondTask = buildTask(
      '0143c815-7220-7d64-8c42-6f2af4f9fd37',
      '0343c815-7220-7d64-8c42-6f2af4f9fd37',
      2,
      '0343c815-7220-7d64-8c42-6f2af4f9fd37',
    );
    const thirdTask = buildTask(
      '0143c815-7220-7d64-8c42-6f2af4f9fd37',
      '0343c815-7220-7d64-8c42-6f2af4f9fd37',
      3,
      '0443c815-7220-7d64-8c42-6f2af4f9fd37',
    );

    list.addTask(firstTask);
    list.addTask(secondTask);
    list.addTask(thirdTask);

    list.removeTask(secondTask);

    const tasks = list.getTasks();
    expect(tasks.map((task) => task.getID().getID())).toEqual([
      firstTask.getID().getID(),
      thirdTask.getID().getID(),
    ]);
    expect(tasks.map((task) => task.getPositionInList().getValue())).toEqual([1, 2]);
  });

  it('exports a list and cascades project ownership to child tasks without emitting task events', () => {
    const originalProject = '0343c815-7220-7d64-8c42-6f2af4f9fd37';
    const newProject = new IdEntity('0543c815-7220-7d64-8c42-6f2af4f9fd37');
    const list = List.create(
      new ListId('0143c815-7220-7d64-8c42-6f2af4f9fd37'),
      new ListTitle(new Text('Backlog')),
      new PositiveInteger(1),
      [
        buildTask(
          '0143c815-7220-7d64-8c42-6f2af4f9fd37',
          originalProject,
          1,
          '0243c815-7220-7d64-8c42-6f2af4f9fd37',
        ),
      ],
      new IdEntity(originalProject),
    );

    const task = list.getTasks()[0] as Task;
    task.pullEvents();

    list.export(newProject, new PositiveInteger(2), 'list-exported-key', new IdEntity('0643c815-7220-7d64-8c42-6f2af4f9fd37'));

    expect((list.getOwner() as IdEntity).getID()).toBe(newProject.getID());
    expect(task.getIdProject().getID()).toBe(newProject.getID());
    expect(task.pullEvents()).toHaveLength(0);
  });

  it('archives and unarchives a list, cascading listArchived state to each task without emitting task events', () => {
    const list = List.create(
      new ListId('0143c815-7220-7d64-8c42-6f2af4f9fd37'),
      new ListTitle(new Text('Backlog')),
      new PositiveInteger(1),
      [
        buildTask(
          '0143c815-7220-7d64-8c42-6f2af4f9fd37',
          '0343c815-7220-7d64-8c42-6f2af4f9fd37',
          1,
          '0243c815-7220-7d64-8c42-6f2af4f9fd37',
        ),
      ],
      new IdEntity('0343c815-7220-7d64-8c42-6f2af4f9fd37'),
    );

    const task = list.getTasks()[0] as Task;
    task.pullEvents();
    const actor = new IdEntity('0643c815-7220-7d64-8c42-6f2af4f9fd37');

    list.archive('list-archived-key', actor);

    expect(list.isArchived()).toBe(true);
    expect(task.isArchivedByList()).toBe(true);
    expect(task.pullEvents()).toHaveLength(0);

    list.unarchive('list-unarchived-key', actor);

    expect(list.isArchived()).toBe(false);
    expect(task.isArchivedByList()).toBe(false);
    expect(task.pullEvents()).toHaveLength(0);
  });

  it('deletes an archived list and soft deletes child tasks by cascade', () => {
    const list = List.create(
      new ListId('0143c815-7220-7d64-8c42-6f2af4f9fd37'),
      new ListTitle(new Text('Backlog')),
      new PositiveInteger(1),
      [
        buildTask(
          '0143c815-7220-7d64-8c42-6f2af4f9fd37',
          '0343c815-7220-7d64-8c42-6f2af4f9fd37',
          1,
          '0243c815-7220-7d64-8c42-6f2af4f9fd37',
        ),
      ],
      new IdEntity('0343c815-7220-7d64-8c42-6f2af4f9fd37'),
    );

    const task = list.getTasks()[0] as Task;
    task.pullEvents();
    const actor = new IdEntity('0643c815-7220-7d64-8c42-6f2af4f9fd37');

    list.archive('list-archived-key', actor);
    list.pullEvents();

    list.delete('list-deleted-key', actor);

    expect(list.exists()).toBe(false);
    expect(task.exists()).toBe(false);
    expect(task.pullEvents()).toHaveLength(0);
  });
});
