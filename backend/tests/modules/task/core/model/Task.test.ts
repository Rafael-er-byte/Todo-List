import { describe, it, expect } from 'vitest';
import Task from '../../../../../src/modules/project/task/core/model/Task';
import TaskTitle from '../../../../../src/modules/project/task/core/objects/TaskTitle';
import TaskState from '../../../../../src/modules/project/task/core/objects/TaskState';
import TaskId from '../../../../../src/modules/project/task/core/objects/TaskId';
import IdEntity from '../../../../../src/modules/shared/core/objects/IdEntity';
import DateTime from '../../../../../src/modules/shared/core/objects/DateTime';
import Text from '../../../../../src/modules/shared/core/objects/Text';
import None from '../../../../../src/modules/shared/core/objects/None';
import Collection from '../../../../../src/modules/shared/core/objects/Collection';
import PositiveInteger from '../../../../../src/modules/shared/core/objects/PositiveInteger';
import TaskNeedsToBeArchivedBeforeDeleteIt from '../../../../../src/modules/project/task/core/error/TaskNeedsToBeArchivedBeforeDeleteIt';
import InvalidStartDate from '../../../../../src/modules/project/task/core/error/InvalidStartDateTime';
import InvalidDueDate from '../../../../../src/modules/project/task/core/error/InvalidDueDateTime';
import ResourceNotFound from '../../../../../src/modules/shared/core/errors/ResourceNotFound';
import RelationshipAlreadyExists from '../../../../../src/modules/shared/core/errors/RelationshipAlreadyExists';
import InvalidParameters from '../../../../../src/modules/shared/core/errors/InvalidParameters';
import InvalidOperation from '../../../../../src/modules/shared/core/errors/InvalidOperation';

const buildTask = () => {
  const listContainer = new IdEntity('0143c815-7220-7d64-8c42-6f2af4f9fd37');
  const projectId = new IdEntity('0343c815-7220-7d64-8c42-6f2af4f9fd37');
  const actor = new IdEntity('0443c815-7220-7d64-8c42-6f2af4f9fd37');

  const task = Task.create(
    {
      title: 'Initial task title',
      listContainer: listContainer.getID(),
      positionInList: 1,
      state: TaskState.pending().getState(),
      archived: false,
      id: '0243c815-7220-7d64-8c42-6f2af4f9fd37',
      idProject: projectId.getID(),
      description: null,
      startDate: null,
      dueDate: null,
      categories: [],
      assigned: [],
      actor: actor.getID(),
      key: 'task-created-key',
    },
  );

  return { task, actor };
};

describe('Task', () => {
  it('creates a task and emits a TaskCreated event', () => {
    const { task } = buildTask();

    const primitives = task.toPrimitives();
    expect(primitives.title).toBe('Initial task title');
    expect(primitives.archived).toBe(false);
    expect(primitives.id).toBe('0243c815-7220-7d64-8c42-6f2af4f9fd37');
    expect(primitives.idProject).toBe('0343c815-7220-7d64-8c42-6f2af4f9fd37');
    expect(primitives.state).toBe('PENDING');
    expect(primitives.listContainer).toBe('0143c815-7220-7d64-8c42-6f2af4f9fd37');
    expect(primitives.positionInList).toBe(1);
    expect(primitives.categories).toEqual([]);
    expect(primitives.assigned).toEqual([]);
    expect(primitives.description).toBeNull();
    expect(task.getIdProject().getID()).toBe('0343c815-7220-7d64-8c42-6f2af4f9fd37');

    const events = task.pullEvents();
    expect(events).toHaveLength(1);
    expect(events[0]!.getEvent()).toBe('TASK_CREATED');
  });

  it('does not allow creating a task with negative position', () => {
    const listContainer = new IdEntity('0143c815-7220-7d64-8c42-6f2af4f9fd37');
    const projectId = new IdEntity('0343c815-7220-7d64-8c42-6f2af4f9fd37');
    const actor = new IdEntity('0443c815-7220-7d64-8c42-6f2af4f9fd37');

    expect(() => Task.create(
      {
        title: 'Initial task title',
        listContainer: listContainer.getID(),
        positionInList: -1,
        state: TaskState.pending().getState(),
        archived: false,
        id: '0243c815-7220-7d64-8c42-6f2af4f9fd37',
        idProject: projectId.getID(),
        description: null,
        startDate: null,
        dueDate: null,
        categories: [],
        assigned: [],
        actor: actor.getID(),
        key: 'task-created-key',
      },
    )).toThrow(InvalidParameters);
  });

  it('returns values from Task getters', () => {
    const { task } = buildTask();

    expect(task.getIdProject().getID()).toBe('0343c815-7220-7d64-8c42-6f2af4f9fd37');
    expect(task.getTitle().getTitle()).toBe('Initial task title');
    expect(task.getListContainer().getID()).toBe('0143c815-7220-7d64-8c42-6f2af4f9fd37');
    expect(task.toPrimitives().positionInList).toBe(1);
    expect(task.getState().getState()).toBe(TaskState.pending().getState());
    expect(task.getDescription()).toBeInstanceOf(None);
    expect(task.getStartDate()).toBeInstanceOf(None);
    expect(task.getDueDate()).toBeInstanceOf(None);
    expect(task.getCategories().getPrimitives()).toEqual([]);
    expect(task.getAssigned().getPrimitives()).toEqual([]);
  });

  it('updates title and emits a TitleUpdated event', () => {
    const { task, actor } = buildTask();
    task.pullEvents();

    task.updateTitle(new TaskTitle('Updated title'), actor, 'title-updated-key');

    const primitives = task.toPrimitives();
    expect(primitives.title).toBe('Updated title');

    const events = task.pullEvents();
    expect(events).toHaveLength(1);
    expect(events[0]!.getEvent()).toBe('TASK_TITLE_UPDATED');
  });

  it('marks task as finished and emits a TaskFinished event', () => {
    const { task, actor } = buildTask();
    task.pullEvents();

    task.markAsFinished(actor, 'finished-key');

    expect(task.toPrimitives().state).toBe('COMPLETED');

    const events = task.pullEvents();
    expect(events).toHaveLength(1);
    expect(events[0]!.getEvent()).toBe('TASK_FINISHED');
  });

  it('adds a category and stores it in primitives', () => {
    const { task, actor } = buildTask();
    task.pullEvents();

    const categoryId = new IdEntity('0543c815-7220-7d64-8c42-6f2af4f9fd37');
    task.addCategory(categoryId, actor, 'category-added-key');

    expect(task.toPrimitives().categories).toEqual(['0543c815-7220-7d64-8c42-6f2af4f9fd37']);

    const events = task.pullEvents();
    expect(events).toHaveLength(1);
    expect(events[0]!.getEvent()).toBe('TASK_CATEGORY_ADDED');
  });

  it('moves a task to a new listContainer and position and emits a TaskMoved event', () => {
    const { task, actor } = buildTask();
    task.pullEvents();

    const newListContainer = new IdEntity('0643c815-7220-7d64-8c42-6f2af4f9fd37');
    task.move(newListContainer, new PositiveInteger(2), actor, 'move-key');

    expect(task.toPrimitives().listContainer).toBe('0643c815-7220-7d64-8c42-6f2af4f9fd37');
    expect(task.toPrimitives().positionInList).toBe(2);
    expect(task.getIdProject().getID()).toBe('0343c815-7220-7d64-8c42-6f2af4f9fd37');

    const events = task.pullEvents();
    expect(events).toHaveLength(1);
    expect(events[0]!.getEvent()).toBe('TASK_MOVED');
  });

  it('exports a task to another project and emits a TaskExported event', () => {
    const { task, actor } = buildTask();
    task.pullEvents();

    const newProject = new IdEntity('2043c815-7220-7d64-8c42-6f2af4f9fd37');
    const newList = new IdEntity('2143c815-7220-7d64-8c42-6f2af4f9fd37');
    task.exportToProject(newProject, newList, new PositiveInteger(5), actor, 'export-key');

    expect(task.toPrimitives().idProject).toBe('2043c815-7220-7d64-8c42-6f2af4f9fd37');
    expect(task.toPrimitives().listContainer).toBe('2143c815-7220-7d64-8c42-6f2af4f9fd37');
    expect(task.toPrimitives().positionInList).toBe(5);

    const events = task.pullEvents();
    expect(events).toHaveLength(1);
    expect(events[0]!.getEvent()).toBe('TASK_EXPORTED');
  });

  it('assigns a member and emits a TaskMemberAdded event', () => { 
    const { task, actor } = buildTask();
    task.pullEvents();

    const assignedMember = new IdEntity('0743c815-7220-7d64-8c42-6f2af4f9fd37');
    task.assignMember(actor, 'assign-key', assignedMember);

    expect(task.toPrimitives().assigned).toEqual(['0743c815-7220-7d64-8c42-6f2af4f9fd37']); 

    const events = task.pullEvents();
    expect(events).toHaveLength(1);
    expect(events[0]!.getEvent()).toBe('TASK_MEMBER_ADDED');
  });

  it('archives and deletes a task successfully', () => {
    const { task, actor } = buildTask();
    task.pullEvents();

    task.archive(actor, 'archive-key');
    expect(task.toPrimitives().archived).toBe(true);

    const archiveEvents = task.pullEvents();
    expect(archiveEvents).toHaveLength(1);
    expect(archiveEvents[0]!.getEvent()).toBe('TASK_ARCHIVED');

    task.delete(actor, 'delete-key');

    const deleteEvents = task.pullEvents();
    expect(deleteEvents).toHaveLength(1);
    expect(deleteEvents[0]!.getEvent()).toBe('TASK_DELETED');
  });

  it('reports overdue correctly when due date is in the future', () => {
    const { task, actor } = buildTask();
    task.pullEvents();

    const futureDate = new Date(Date.now() + 1000 * 60 * 60);
    task.updateDueDate(DateTime.create(futureDate), actor, 'due-key');

    expect(task.overDue()).toBe(false);
    const primitives = task.toPrimitives();
    expect(primitives.dueDate).toEqual(futureDate);
  });

  it('adds multiple categories and assigneds correctly', () => {
    const { task, actor } = buildTask();
    task.pullEvents();

    const category1 = new IdEntity('0843c815-7220-7d64-8c42-6f2af4f9fd37');
    const category2 = new IdEntity('0943c815-7220-7d64-8c42-6f2af4f9fd37');
    const assigned1 = new IdEntity('0a43c815-7220-7d64-8c42-6f2af4f9fd37');
    const assigned2 = new IdEntity('0b43c815-7220-7d64-8c42-6f2af4f9fd37');

    task.addCategory(category1, actor, 'cat1-key');
    task.addCategory(category2, actor, 'cat2-key');
    task.assignMember(actor, 'assign1-key', assigned1);
    task.assignMember(actor, 'assign2-key', assigned2);

    expect(() => task.assignMember(actor, 'assign2-key', assigned2)).toThrow(RelationshipAlreadyExists);

    const primitives = task.toPrimitives();
    expect(primitives.categories).toEqual(['0843c815-7220-7d64-8c42-6f2af4f9fd37', '0943c815-7220-7d64-8c42-6f2af4f9fd37']);
    expect(primitives.assigned).toEqual(['0a43c815-7220-7d64-8c42-6f2af4f9fd37', '0b43c815-7220-7d64-8c42-6f2af4f9fd37']); 
  });

  it('throws error when trying to delete a category that does not exist', () => {
    const { task, actor } = buildTask();
    task.pullEvents();

    const nonExistentCategory = new IdEntity('0c43c815-7220-7d64-8c42-6f2af4f9fd37');

    expect(() => {
      task.removeCategory(nonExistentCategory, actor, 'remove-key');
    }).toThrow(ResourceNotFound);
  });

  it('throws error when trying to delete an assigned that does not exist', () => {
    const { task, actor } = buildTask();
    task.pullEvents();

    const nonExistentAssigned = new IdEntity('0d43c815-7220-7d64-8c42-6f2af4f9fd37');

    expect(() => {
      task.removeAssigned(nonExistentAssigned, actor, 'remove-key');
    }).toThrow(ResourceNotFound);
  });

  it('allows modifying archived tasks after available checks are removed', () => {
    const { task, actor } = buildTask();
    task.pullEvents();

    task.archive(actor, 'archive-key');
    task.pullEvents(); 
    const categoryId = new IdEntity('0e43c815-7220-7d64-8c42-6f2af4f9fd37');
    const assignedId = new IdEntity('0f43c815-7220-7d64-8c42-6f2af4f9fd37');
    expect(() => task.addCategory(categoryId, actor, 'add-cat-key')).toThrow(InvalidOperation);
    expect(() => task.assignMember(actor, 'assign-key', assignedId)).toThrow(InvalidOperation);
    expect(() => task.updateTitle(new TaskTitle('New Title'), actor, 'update-title-key')).toThrow(InvalidOperation);
    expect(() => task.move(new IdEntity('1043c815-7220-7d64-8c42-6f2af4f9fd37'), new PositiveInteger(3), actor, 'move-key')).toThrow(InvalidOperation);
    expect(() => task.markAsFinished(actor, 'finish-key')).toThrow(InvalidOperation);
  });

  it('marks task as started and emits a TaskStarted event', () => {
    const { task } = buildTask();
    task.pullEvents();

    const primitivesBefore = task.toPrimitives();
    expect(primitivesBefore.isStarted).toBe(false);

    task.setStarted('start-key');

    expect(task.toPrimitives().isStarted).toBe(true);

    const events = task.pullEvents();
    expect(events).toHaveLength(1);
    expect(events[0]!.getEvent()).toBe('TASK_STARTED');
  });

  it('marks task as overdue and emits a TaskOverdue event', () => {
    const { task } = buildTask();
    task.pullEvents();

    const primitivesBefore = task.toPrimitives();
    expect(primitivesBefore.isOverdue).toBe(false);

    task.setOverDue('overdue-key');

    expect(task.toPrimitives().isOverdue).toBe(true);

    const events = task.pullEvents();
    expect(events).toHaveLength(1);
    expect(events[0]!.getEvent()).toBe('TASK_OVERDUE');
  });

  it('throws TaskNeedsToBeArchivedBeforeDeleteIt when trying to delete non-archived task', () => {
    const { task, actor } = buildTask();
    task.pullEvents();

    expect(() => task.delete(actor, 'delete-key')).toThrow(TaskNeedsToBeArchivedBeforeDeleteIt);
  });

  it('can be deleted only after it is archived', () => {
    const { task, actor } = buildTask();
    task.pullEvents();

    task.archive(actor, 'archive-key');
    task.pullEvents();

    expect(() => task.delete(actor, 'delete-key')).not.toThrow();
    task.pullEvents();
  });

  it('throws error when trying to archive a deleted task', () => {
    const { task, actor } = buildTask();
    task.pullEvents();

    task.archive(actor, 'archive-key');
    task.pullEvents(); 
    task.delete(actor, 'delete-key');
    task.pullEvents(); 

    expect(() => task.archive(actor, 'archive-again-key')).toThrow();
  });

  it('returns correct primitives for all fields', () => {
    const { task, actor } = buildTask();
    task.pullEvents();

    const categoryId = new IdEntity('1143c815-7220-7d64-8c42-6f2af4f9fd37');
    const assignedId = new IdEntity('1243c815-7220-7d64-8c42-6f2af4f9fd37');
    const description = new Text('Task description');
    const startDate = new Date(Date.now() - 1000 * 60 * 60);
    const dueDate = new Date(Date.now() + 1000 * 60 * 60);

    task.addCategory(categoryId, actor, 'add-cat-key');
    task.assignMember(actor, 'assign-key', assignedId);
    task.updateDescription(description, actor, 'desc-key');
    task.updateStartDate(DateTime.create(startDate), actor, 'start-key');
    task.updateDueDate(DateTime.create(dueDate), actor, 'due-key');
    task.markAsFinished(actor, 'finish-key');

    const primitives = task.toPrimitives();

    expect(primitives.title).toBe('Initial task title');
    expect(primitives.state).toBe('COMPLETED');
    expect(primitives.archived).toBe(false);
    expect(primitives.listContainer).toBe('0143c815-7220-7d64-8c42-6f2af4f9fd37');
    expect(primitives.categories).toEqual(['1143c815-7220-7d64-8c42-6f2af4f9fd37']);
    expect(primitives.assigned).toEqual(['1243c815-7220-7d64-8c42-6f2af4f9fd37']);
    expect(primitives.description).toBe('Task description');
    expect(primitives.startDate).toEqual(startDate);
    expect(primitives.dueDate).toEqual(dueDate);
    expect(primitives.id).toBe('0243c815-7220-7d64-8c42-6f2af4f9fd37');
    expect(primitives.idProject).toBe('0343c815-7220-7d64-8c42-6f2af4f9fd37');
    expect(task.getIdProject().getID()).toBe('0343c815-7220-7d64-8c42-6f2af4f9fd37');
    expect(primitives.deletedAt).toBeUndefined();
  });

  it('throws InvalidStartDate when start date is not before due date', () => {
    const { task, actor } = buildTask();
    task.pullEvents();

    const dueDate = new Date(Date.now() + 1000 * 60 * 60); 
    const startDate = new Date(Date.now() + 2 * 1000 * 60 * 60); 

    task.updateDueDate(DateTime.create(dueDate), actor, 'due-key');
    task.pullEvents();

    expect(() => {
      task.updateStartDate(DateTime.create(startDate), actor, 'start-key');
    }).toThrow(InvalidStartDate);
  });

  it('throws InvalidDueDate when due date is not after start date', () => {
    const { task, actor } = buildTask();
    task.pullEvents();

    const startDate = new Date(Date.now() + 2 * 1000 * 60 * 60); 
    const dueDate = new Date(Date.now() + 1000 * 60 * 60); 

    task.updateStartDate(DateTime.create(startDate), actor, 'start-key');
    task.pullEvents();

    expect(() => {
      task.updateDueDate(DateTime.create(dueDate), actor, 'due-key');
    }).toThrow(InvalidDueDate);
  });

  it('allows setting start date before due date', () => {
    const { task, actor } = buildTask();
    task.pullEvents();

    const startDate = new Date(Date.now() + 1000 * 60 * 60); 
    const dueDate = new Date(Date.now() + 2 * 1000 * 60 * 60); 
    task.updateDueDate(DateTime.create(dueDate), actor, 'due-key');
    task.pullEvents();

    expect(() => {
      task.updateStartDate(DateTime.create(startDate), actor, 'start-key');
    }).not.toThrow();

    const primitives = task.toPrimitives();
    expect(primitives.startDate).toEqual(startDate);
    expect(primitives.dueDate).toEqual(dueDate);
  });

  it('allows setting due date after start date', () => {
    const { task, actor } = buildTask();
    task.pullEvents();

    const startDate = new Date(Date.now() + 1000 * 60 * 60); 
    const dueDate = new Date(Date.now() + 2 * 1000 * 60 * 60); 

    task.updateStartDate(DateTime.create(startDate), actor, 'start-key');
    task.pullEvents();

    expect(() => {
      task.updateDueDate(DateTime.create(dueDate), actor, 'due-key');
    }).not.toThrow();

    const primitives = task.toPrimitives();
    expect(primitives.startDate).toEqual(startDate);
    expect(primitives.dueDate).toEqual(dueDate);
  });

});
