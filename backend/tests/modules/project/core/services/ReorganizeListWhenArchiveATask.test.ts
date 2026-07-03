import { describe, expect, it } from 'vitest';
import List from '../../../../../src/modules/project/list/core/model/List';
import TaskEntry from '../../../../../src/modules/project/list/core/aggregates/TaskEntry';
import ReorganizeListWhenArchiveATask from '../../../../../src/modules/project/project/core/services/ReorganizeListWhenArchiveATask';
import Task from '../../../../../src/modules/project/task/core/model/Task';
import CannotModifyArchivedList from '../../../../../src/modules/project/list/core/errors/CannotModifyArchivedList';
import ResourceNotFound from '../../../../../src/modules/shared/core/errors/ResourceNotFound';
import IdEntity from '../../../../../src/modules/shared/core/objects/IdEntity';
import PositiveInteger from '../../../../../src/modules/shared/core/objects/PositiveInteger';

const PROJECT_ID = '0143c815-7220-7d64-8c42-6f2af4f9fd37';

const buildTaskEntry = (id: string, position: number): TaskEntry => {
  const entry = new TaskEntry();
  entry.id = new IdEntity(id);
  entry.position = new PositiveInteger(position);
  entry.project = new IdEntity(PROJECT_ID);
  entry.archivedByList = false;
  return entry;
};

const buildList = (entries: TaskEntry[], archived = false): List =>
  List.fromPrimitives({
    id: '0243c815-7220-7d64-8c42-6f2af4f9fd37',
    title: 'Backlog',
    position: 1,
    archived,
    tasks: entries,
    projectId: PROJECT_ID,
  });

const buildTask = (id: string, positionInList: number): Task =>
  Task.fromPrimitives({
    title: 'Task to archive',
    listContainer: '0243c815-7220-7d64-8c42-6f2af4f9fd37',
    positionInList,
    state: 'PENDING',
    archived: true,
    available: false,
    id,
    idProject: PROJECT_ID,
    assigned: [],
    categories: [],
    description: null,
    startDate: null,
    dueDate: null,
    isOverdue: false,
    isStarted: false,
  });

describe('ReorganizeListWhenArchiveATask service', () => {
  it('removes archived task entry from list and reorders positions', () => {
    const removedTaskId = '0343c815-7220-7d64-8c42-6f2af4f9fd37';
    const list = buildList([
      buildTaskEntry('0443c815-7220-7d64-8c42-6f2af4f9fd37', 1),
      buildTaskEntry(removedTaskId, 2),
      buildTaskEntry('0543c815-7220-7d64-8c42-6f2af4f9fd37', 3),
    ]);
    const task = buildTask(removedTaskId, 2);

    ReorganizeListWhenArchiveATask(task, list);

    const tasks = list.getTasks();
    expect(tasks).toHaveLength(2);
    expect(tasks.map((item) => item.id.toString())).toEqual([
      '0443c815-7220-7d64-8c42-6f2af4f9fd37',
      '0543c815-7220-7d64-8c42-6f2af4f9fd37',
    ]);
    expect(tasks.map((item) => item.position.getValue())).toEqual([1, 2]);
  });

  it('throws ResourceNotFound when task entry is not found in list', () => {
    const list = buildList([
      buildTaskEntry('0643c815-7220-7d64-8c42-6f2af4f9fd37', 1),
    ]);
    const task = buildTask('0743c815-7220-7d64-8c42-6f2af4f9fd37', 1);

    expect(() => ReorganizeListWhenArchiveATask(task, list)).toThrow(ResourceNotFound);
  });

  it('throws CannotModifyArchivedList when target list is archived', () => {
    const taskId = '0843c815-7220-7d64-8c42-6f2af4f9fd37';
    const list = buildList([
      buildTaskEntry(taskId, 1),
    ]);
    list.archive('archive-key', new IdEntity('0943c815-7220-7d64-8c42-6f2af4f9fd37'));
    const task = buildTask(taskId, 1);

    expect(() => ReorganizeListWhenArchiveATask(task, list)).toThrow(CannotModifyArchivedList);
  });
});
