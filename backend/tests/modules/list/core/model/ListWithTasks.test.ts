import { describe, expect, it } from 'vitest';
import List from '../../../../../src/modules/list/core/model/List';
import ListId from '../../../../../src/modules/list/core/object/ListId';
import ListTitle from '../../../../../src/modules/list/core/object/ListTitle';
import IdEntity from '../../../../../src/modules/shared/core/objects/IdEntity';
import InvalidPositionInList from '../../../../../src/modules/list/core/errors/InvalidPositionInList';
import PositiveInteger from '../../../../../src/modules/shared/core/objects/PositiveInteger';
import Text from '../../../../../src/modules/shared/core/objects/Text';
import None from '../../../../../src/modules/shared/core/objects/None';
import TaskList from '../../../../../src/modules/list/core/object/TaskList';

const buildList = () =>
  List.create(
    {
      id: '0143c815-7220-7d64-8c42-6f2af4f9fd37',
      title: 'Backlog',
      position: 1,
      tasks: [],
      projectId: '0343c815-7220-7d64-8c42-6f2af4f9fd37',
    },
  );

const buildTask = (id = '0143c815-7220-7d64-8c42-6f2af4f9fd37', position = 1, project = '0343c815-7220-7d64-8c42-6f2af4f9fd37') => {
  return new TaskList(new IdEntity(id), new PositiveInteger(position), new IdEntity(project));
}

describe('List with tasks', () => {
  it('does not allow adding a task with an invalid position', () => {
    const list = buildList();
    const task = buildTask(undefined, 2)

    expect(() => list.addTask(task)).toThrow(InvalidPositionInList);
  });

  it('inserts and shifts tasks in a 1-based position list', () => {
    const list = buildList();
    const firstTask = buildTask('0143c815-7220-7d64-8c42-6f2af4f9fd38', 1);
    const secondTask = buildTask('0143c815-7220-7d64-8c42-6f2af4f9fd39', 2);
    const insertedTask = buildTask('0143c815-7220-7d64-8c42-6f2af4f9fd40', 1);

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

  it('removes a task and updates later task positions', () => {
    const list = buildList();
    const firstTask = buildTask('0143c815-7220-7d64-8c42-6f2af4f9fd41', 1);
    const secondTask = buildTask('0143c815-7220-7d64-8c42-6f2af4f9fd42', 2);
    const thirdTask = buildTask('0143c815-7220-7d64-8c42-6f2af4f9fd43', 3);

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

  it('exports a list to a new project without emitting task events', () => {
    const originalProject = '0343c815-7220-7d64-8c42-6f2af4f9fd37';
    const newProject = new IdEntity('0543c815-7220-7d64-8c42-6f2af4f9fd37');
    const list = List.create(
      {
        id: '0143c815-7220-7d64-8c42-6f2af4f9fd37',
        title: 'Backlog',
        position: 1,
        tasks: [
          buildTask('0143c815-7220-7d64-8c42-6f2af4f9fd44', 1, originalProject),
        ],
        projectId: originalProject,
      },
    );

    const task = list.getTasks()[0];

    list.export(newProject, new PositiveInteger(2), 'list-exported-key', new IdEntity('0643c815-7220-7d64-8c42-6f2af4f9fd37'));

    expect(list.getProjectId().getID()).toBe(newProject.getID());
    expect(task!.project.getID()).toBe(newProject.getID());
  });
});
