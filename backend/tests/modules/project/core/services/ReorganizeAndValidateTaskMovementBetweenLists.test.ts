import { describe, expect, it } from 'vitest';
import List from '../../../../../src/modules/project/list/core/model/List';
import ReorganizeAndValidateTaskMovementBetweenLists from '../../../../../src/modules/project/project/core/services/ReorganizeAndValidateTaskMovementBetweenLists';
import Task from '../../../../../src/modules/project/task/core/model/Task';
import InvalidPositionInList from '../../../../../src/modules/project/list/core/errors/InvalidPositionInList';
import ResourceNotFound from '../../../../../src/modules/shared/core/errors/ResourceNotFound';
import IdEntity from '../../../../../src/modules/shared/core/objects/IdEntity';
import PositiveInteger from '../../../../../src/modules/shared/core/objects/PositiveInteger';
import TaskEntry from '../../../../../src/modules/project/list/core/aggregates/TaskEntry';

const PROJECT_ID = '0343c815-7220-7d64-8c42-6f2af4f9fd37';

const buildTaskEntry = (id: string, position: number, projectId = PROJECT_ID, archivedByList = false): TaskEntry => {
  const taskEntry = new TaskEntry();
  taskEntry.id = new IdEntity(id);
  taskEntry.position = new PositiveInteger(position);
  taskEntry.project = new IdEntity(projectId);
  taskEntry.archivedByList = archivedByList;
  return taskEntry;
};

const buildList = (id: string, tasks: TaskEntry[]) =>
  List.fromPrimitives({
    id,
    title: 'Backlog',
    position: 1,
    archived: false,
    tasks,
    projectId: PROJECT_ID,
  });

const buildTask = (id: string, positionInList: number, listContainer: string, available = false): Task =>
  Task.fromPrimitives({
    title: 'Task to move',
    listContainer,
    positionInList,
    state: 'PENDING',
    archived: false,
    available,
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

describe('ReorganizeAndValidateTaskMovementBetweenLists service', () => {
  it('moves a task entry from one list to another preserving task movement payload', () => {
    const movedTaskId = '0243c815-7220-7d64-8c42-6f2af4f9fd37';
    const fromList = buildList('0143c815-7220-7d64-8c42-6f2af4f9fd37', [
      buildTaskEntry('0543c815-7220-7d64-8c42-6f2af4f9fd37', 1),
      buildTaskEntry(movedTaskId, 2),
    ]);
    const toList = buildList('0743c815-7220-7d64-8c42-6f2af4f9fd37', [
      buildTaskEntry('0843c815-7220-7d64-8c42-6f2af4f9fd37', 1),
    ]);
    const task = buildTask(movedTaskId, 2, fromList.getID().toString(), true);

    ReorganizeAndValidateTaskMovementBetweenLists(fromList, toList, task);

    const fromEntries = fromList.getTasks();
    expect(fromEntries).toHaveLength(1);
    expect(fromEntries[0]!.id.toString()).toBe('0543c815-7220-7d64-8c42-6f2af4f9fd37');

    const toEntries = toList.getTasks();
    expect(toEntries).toHaveLength(2);
    expect(toEntries.map((entry) => entry.id.toString())).toEqual([
      '0843c815-7220-7d64-8c42-6f2af4f9fd37',
      movedTaskId,
    ]);
    expect(toEntries[1]!.position.getValue()).toBe(2);
    expect(toEntries[1]!.archivedByList).toBe(true);
    expect(toEntries[1]!.project.toString()).toBe(PROJECT_ID);
  });

  it('throws ResourceNotFound when the task does not exist in source list', () => {
    const missingTaskId = '1243c815-7220-7d64-8c42-6f2af4f9fd37';
    const fromList = buildList('0143c815-7220-7d64-8c42-6f2af4f9fd37', [
      buildTaskEntry('0543c815-7220-7d64-8c42-6f2af4f9fd37', 1),
    ]);
    const toList = buildList('0743c815-7220-7d64-8c42-6f2af4f9fd37', []);
    const task = buildTask(missingTaskId, 1, fromList.getID().toString());

    expect(() => ReorganizeAndValidateTaskMovementBetweenLists(fromList, toList, task)).toThrow(ResourceNotFound);
  });

  it('throws InvalidPositionInList when destination insertion position is invalid', () => {
    const movedTaskId = '2243c815-7220-7d64-8c42-6f2af4f9fd37';
    const fromList = buildList('0143c815-7220-7d64-8c42-6f2af4f9fd37', [
      buildTaskEntry(movedTaskId, 1),
    ]);
    const toList = buildList('0743c815-7220-7d64-8c42-6f2af4f9fd37', []);
    const task = buildTask(movedTaskId, 2, fromList.getID().toString());

    expect(() => ReorganizeAndValidateTaskMovementBetweenLists(fromList, toList, task)).toThrow(InvalidPositionInList);
  });
});
