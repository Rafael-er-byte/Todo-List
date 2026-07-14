import { describe, expect, it } from 'vitest';
import List from '../../../../../../src/modules/project/list/core/model/List';
import ReorganizeAndValidateTaskMovementBetweenLists from '../../../../../../src/modules/project/project/core/services/ReorganizeAndValidateTaskMovementBetweenLists';
import Task from '../../../../../../src/modules/project/task/core/model/Task';
import CannotModifyArchivedList from '../../../../../../src/modules/project/list/core/errors/CannotModifyArchivedList';
import InvalidPositionInList from '../../../../../../src/modules/project/list/core/errors/InvalidPositionInList';
import ResourceNotFound from '../../../../../../src/modules/shared/core/errors/ResourceNotFound';
import IdEntity from '../../../../../../src/modules/shared/core/objects/IdEntity';
import PositiveInteger from '../../../../../../src/modules/shared/core/objects/PositiveInteger';
import TaskEntry from '../../../../../../src/modules/project/list/core/aggregates/TaskEntry';

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
    const task = buildTask(movedTaskId, 2, fromList.getId().toString(), true);

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
    const task = buildTask(missingTaskId, 1, fromList.getId().toString());

    expect(() => ReorganizeAndValidateTaskMovementBetweenLists(fromList, toList, task)).toThrow(ResourceNotFound);
  });

  it('throws InvalidPositionInList when destination insertion position is invalid', () => {
    const movedTaskId = '2243c815-7220-7d64-8c42-6f2af4f9fd37';
    const fromList = buildList('0143c815-7220-7d64-8c42-6f2af4f9fd37', [
      buildTaskEntry(movedTaskId, 1),
    ]);
    const toList = buildList('0743c815-7220-7d64-8c42-6f2af4f9fd37', []);
    const task = buildTask(movedTaskId, 2, fromList.getId().toString());

    expect(() => ReorganizeAndValidateTaskMovementBetweenLists(fromList, toList, task)).toThrow(InvalidPositionInList);
  });

  it('safely moves a first-position task and reindexes source and destination lists', () => {
    const movedTaskId = '3243c815-7220-7d64-8c42-6f2af4f9fd37';
    const fromList = buildList('0143c815-7220-7d64-8c42-6f2af4f9fd37', [
      buildTaskEntry(movedTaskId, 1),
      buildTaskEntry('3343c815-7220-7d64-8c42-6f2af4f9fd37', 2),
      buildTaskEntry('3443c815-7220-7d64-8c42-6f2af4f9fd37', 3),
    ]);
    const toList = buildList('0743c815-7220-7d64-8c42-6f2af4f9fd37', [
      buildTaskEntry('3543c815-7220-7d64-8c42-6f2af4f9fd37', 1),
      buildTaskEntry('3643c815-7220-7d64-8c42-6f2af4f9fd37', 2),
    ]);
    const task = buildTask(movedTaskId, 1, fromList.getId().toString());

    expect(() => ReorganizeAndValidateTaskMovementBetweenLists(fromList, toList, task)).not.toThrow();

    const fromEntries = fromList.getTasks();
    expect(fromEntries.map((entry) => entry.id.toString())).toEqual([
      '3343c815-7220-7d64-8c42-6f2af4f9fd37',
      '3443c815-7220-7d64-8c42-6f2af4f9fd37',
    ]);
    expect(fromEntries.map((entry) => entry.position.getValue())).toEqual([1, 2]);

    const toEntries = toList.getTasks();
    expect(toEntries.map((entry) => entry.id.toString())).toEqual([
      movedTaskId,
      '3543c815-7220-7d64-8c42-6f2af4f9fd37',
      '3643c815-7220-7d64-8c42-6f2af4f9fd37',
    ]);
    expect(toEntries.map((entry) => entry.position.getValue())).toEqual([1, 2, 3]);
  });

  it('throws CannotModifyArchivedList when source list is archived', () => {
    const movedTaskId = '3743c815-7220-7d64-8c42-6f2af4f9fd37';
    const actor = new IdEntity('3843c815-7220-7d64-8c42-6f2af4f9fd37');
    const fromList = buildList('0143c815-7220-7d64-8c42-6f2af4f9fd37', [
      buildTaskEntry(movedTaskId, 1),
    ]);
    const toList = buildList('0743c815-7220-7d64-8c42-6f2af4f9fd37', []);
    const task = buildTask(movedTaskId, 1, fromList.getId().toString());

    fromList.archive('archive-source-key', actor);

    expect(() => ReorganizeAndValidateTaskMovementBetweenLists(fromList, toList, task)).toThrow(CannotModifyArchivedList);
  });

  it('throws CannotModifyArchivedList when destination list is archived', () => {
    const movedTaskId = '3943c815-7220-7d64-8c42-6f2af4f9fd37';
    const actor = new IdEntity('3a43c815-7220-7d64-8c42-6f2af4f9fd37');
    const fromList = buildList('0143c815-7220-7d64-8c42-6f2af4f9fd37', [
      buildTaskEntry(movedTaskId, 1),
      buildTaskEntry('3b43c815-7220-7d64-8c42-6f2af4f9fd37', 2),
    ]);
    const toList = buildList('0743c815-7220-7d64-8c42-6f2af4f9fd37', []);
    const task = buildTask(movedTaskId, 1, fromList.getId().toString());

    toList.archive('archive-target-key', actor);

    expect(() => ReorganizeAndValidateTaskMovementBetweenLists(fromList, toList, task)).toThrow(CannotModifyArchivedList);
  });
});
