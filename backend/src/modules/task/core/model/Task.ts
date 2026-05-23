import Entity from '../../../shared/core/model/Entity';
import DateTime from '../../../shared/core/objects/DateTime';
import None from '../../../shared/core/objects/None';
import TaskArchived from '../events/TaskArchived';
import TaskDescriptionUpdated from '../events/TaskDescriptionUpdated';
import TaskDueDateUpdated from '../events/TaskDueDateUpdated';
import TaskFinished from '../events/TaskFinished';
import TaskMarkedAsPending from '../events/TaskMarkedAsPending';
import TaskMoved from '../events/TaskMoved';
import TaskBeginDateUpdated from '../events/TaskStartDateUpdated';
import TaskUnarchived from '../events/TaskUnarchived';
import TitleUpdated from '../events/TitleUpdated';
import TaskId from '../objects/TaskId';
import TaskTitle from '../objects/TaskTitle';
import TaskCreated from '../events/TaskCreated';
import TaskState from '../objects/TaskState';
import TaskDeleted from '../events/TaskDeleted';
import CannotModifyArchivedTasks from '../error/CannotModifyArchivedTasks';
import TaskNeedsToBeArchivedBeforeDeleteIt from '../error/TaskNeedsToBeArchivedBeforeDeleteIt';
import InvalidStartDate from '../error/InvalidStartDateTime';
import InvalidDueDate from '../error/InvalidDueDateTime';
import TaskCategoryAdded from '../events/TaskCategoryAdded';
import TaskCategoryDeleted from '../events/TaskCategoryDeleted';
import TaskContributorDeleted from '../events/TaskMemberDeleted';
import TaskMemberAdded from '../events/TaskMemberAdded';
import IdEntity from '../../../shared/core/objects/IdEntity';
import type TaskParams from '../interface/TaskParams';
import Version from '../../../shared/core/objects/Version';
import DeletedAt from '../../../shared/core/objects/DeletedAt';
import Text from '../../../shared/core/objects/Text';
import type { AllowedTaskState } from '../types/AllowedTaskState';
import Collection from '../../../shared/core/objects/Collection';
import InvalidOperation from '../../../shared/core/errors/InvalidOperation';
import TaskStarted from '../events/TaskStarted';
import TaskOverDue from '../events/TaskOverDue';
import IntNumber from '../../../shared/core/objects/IntNumber';

export default class Task extends Entity {
  private title!: TaskTitle;
  private listContainer!: IdEntity;
  private positionInList!: IntNumber;
  private state!: TaskState;
  private archived: boolean = false;
  private description!: Text | None;

  private startDate: DateTime | None = new None();
  private dueDate: DateTime | None = new None();

  private isStarted: boolean = false;
  private isOverdue: boolean = false;

  private categories: Collection = new Collection([], [], []);
  private assigned: Collection = new Collection([], [], []);

  private constructor(
    title: TaskTitle,
    listContainer: IdEntity,
    positionInList: IntNumber,
    state: TaskState,
    archived: boolean,
    id: TaskId,
    idProject: IdEntity,
    description: Text | None,
    startDate: DateTime | None,
    dueDate: DateTime | None,
    isOverDue: boolean,
    isStarted: boolean,
    categories: Collection,
    assigned: Collection
  ) {
    super(id, idProject);
    this.title = title;
    this.archived = archived;
    this.state = state;
    this.description = description;
    this.startDate = startDate;
    this.dueDate = dueDate;
    this.isOverdue = isOverDue;
    this.isStarted = isStarted;
    this.listContainer = listContainer;
    this.positionInList = positionInList; 
    this.categories = categories;
    this.assigned = assigned;
  }

  public static create(
    title: TaskTitle,
    listContainer: IdEntity,
    positionInList: IntNumber,
    state: TaskState,
    archived: boolean,
    id: TaskId,
    idProject: IdEntity,
    description: Text | None,
    startDate: DateTime | None,
    dueDate: DateTime | None,
    categories: Collection,
    assigned: Collection,
    actor: IdEntity, 
    key: string
  ): Task {
  
    const task = new Task(
        title,
        listContainer,
        positionInList,
        state,
        archived,
        id,
        idProject,
        description,
        startDate,
        dueDate,
        false,
        false,
        categories,
        assigned
    );

    task.create();
    task.addEvent(
      new TaskCreated(key, DateTime.now(), actor, task.getIdProject(), task.getID(), task.toPrimitives()),
    );
    return task;
  }

  public static fromPrimitives(params: TaskParams): Task{
    const categories = params.categories.map((category) => {
      return new IdEntity(category);
    });

    const assigned = params.assigned.map((assign) => {
      return new IdEntity(assign);
    });

    const task = new Task(
      new TaskTitle(params.title),
      new IdEntity(params.listContainer),
      new IntNumber(params.positionInList),
      TaskState.create(params.state as AllowedTaskState),
      params.archived,
      new TaskId(params.id),
      new IdEntity(params.idProject),
      params.description ? new Text(params.description) : new None(),
      params.startDate instanceof Date ? DateTime.create(params.startDate) : new None(),
      params.dueDate instanceof Date ? DateTime.create(params.dueDate) : new None(),
      params.isOverdue,
      params.isStarted,
      new Collection(categories, [], []),
      new Collection(assigned, [], [])
    );

    task.build(new Version(params.version as number), DeletedAt.createFromPrimitive(params.deletedAt));
    return task;
  }

  public delete(actor: IdEntity, key: string): void {
    if (!this.isArchived()) {
      throw new TaskNeedsToBeArchivedBeforeDeleteIt(super.getID());
    }
    this.addEvent(new TaskDeleted(key, DateTime.now(), actor, this.getIdProject(), super.getID()));
    super.softDelete();
  }

  public removeCategory(category: IdEntity, actor: IdEntity, key: string): void {
    if (this.isArchived()) throw new CannotModifyArchivedTasks(super.getID());
    this.categories = this.categories.deleteItem(category);
    this.addEvent(
      new TaskCategoryDeleted(key, DateTime.now(), actor, this.getIdProject(), super.getID(), category),
    );
  }

  public removeAssigned(assigned: IdEntity, actor: IdEntity, key: string): void {
    if (this.isArchived()) throw new CannotModifyArchivedTasks(super.getID());
    this.assigned = this.assigned.deleteItem(assigned);
    this.addEvent(
      new TaskContributorDeleted(key, DateTime.now(), actor, this.getIdProject(), super.getID(), assigned),
    );
  }

  public move(list: IdEntity, positionInList: IntNumber, actor: IdEntity, key: string): void {
    if (this.isArchived()) throw new CannotModifyArchivedTasks(super.getID());
    this.listContainer = list;
    this.positionInList = positionInList;
    this.addEvent(new TaskMoved(key, DateTime.now(), actor, this.getIdProject(), super.getID(), this.listContainer, this.positionInList));
  }

  public unarchive(actor: IdEntity, key: string): void {
    this.archived = false;
    this.addEvent(new TaskUnarchived(key, DateTime.now(), actor, this.getIdProject(), super.getID()));
  }

  public archive(actor: IdEntity, key: string): void {
    this.archived = true;
    this.addEvent(new TaskArchived(key, DateTime.now(), actor, this.getIdProject(), super.getID()));
  }

  public assignMember(actor: IdEntity, key: string, assigned: IdEntity): void {
    if (this.isArchived()) throw new CannotModifyArchivedTasks(super.getID());
    this.assigned = this.assigned.addItem(assigned);
    this.addEvent(new TaskMemberAdded(key, DateTime.now(), actor, this.getIdProject(), super.getID(), assigned));
  }

  public updateStartDate(date: DateTime, actor: IdEntity, key: string): void {
    if (this.isArchived()) throw new CannotModifyArchivedTasks(super.getID());
    if (this.dueDate instanceof DateTime) {
      if (!DateTime.isBefore(date, this.dueDate)) {
        throw new InvalidStartDate({ startDate: date, dueDate: this.dueDate });
      }
    }
    this.startDate = date;
    this.addEvent(
      new TaskBeginDateUpdated(
        key,
        DateTime.now(),
        actor,
        this.getIdProject(),
        super.getID(),
        this.startDate as DateTime,
      ),
    );
  }

  public updateDueDate(date: DateTime, actor: IdEntity, key: string): void {
    if (this.isArchived()) throw new CannotModifyArchivedTasks(super.getID());
    if (this.startDate instanceof DateTime) {
      if (!DateTime.isAfter(date, this.startDate)) {
        throw new InvalidDueDate({ dueDate: date, startDate: this.startDate });
      }
    }
    this.dueDate = date;
    this.addEvent(
      new TaskDueDateUpdated(
        key,
        DateTime.now(),
        actor,
        this.getIdProject(),
        super.getID(),
        this.dueDate as DateTime,
      ),
    );
  }

  public updateTitle(title: TaskTitle, actor: IdEntity, key: string): void {
    if (this.isArchived()) throw new CannotModifyArchivedTasks(super.getID());
    this.title = title;
    this.addEvent(
      new TitleUpdated(key, DateTime.now(), actor, this.getIdProject(), super.getID(), this.title),
    );
  }

  public updateDescription(description: Text, actor: IdEntity, key: string): void {
    if (this.isArchived()) throw new CannotModifyArchivedTasks(super.getID());
    this.description = description;
 
    this.addEvent(
      new TaskDescriptionUpdated(
        key,
        DateTime.now(),
        actor,
        this.getIdProject(),
        super.getID(),
        description,
      ),
    );
  }

  public addCategory(category: IdEntity, actor: IdEntity, key: string): void {
    if (this.isArchived()) throw new CannotModifyArchivedTasks(super.getID());
    this.categories = this.categories.addItem(category);
    this.addEvent(
      new TaskCategoryAdded(key, DateTime.now(), actor, this.getIdProject(), super.getID(), category),
    );
  }

  public markAsFinished(actor: IdEntity, key: string): void {
    if (this.isArchived()) throw new CannotModifyArchivedTasks(super.getID());
    if (this.state.isCompleted()) return;
    this.state = TaskState.completed();
    this.addEvent(new TaskFinished(key, DateTime.now(), actor, this.getIdProject(), super.getID()));
  }

  public markAsPending(actor: IdEntity, key: string): void {
    if (this.isArchived()) throw new CannotModifyArchivedTasks(super.getID());
    if (!this.state.isCompleted()) return;
    this.state = TaskState.pending();
    this.addEvent(new TaskMarkedAsPending(key, DateTime.now(), actor, this.getIdProject(), super.getID()));
  }

  protected isArchived(): boolean {
    return this.archived;
  }

  protected isCompleted(): boolean {
    return this.state.isCompleted();
  }

  public exportToProject(idProject: IdEntity, idList: IdEntity): void{
    this.listContainer = idList;
    super.changeOwner(idProject);
  }

  public overDue(): boolean {
    if (this.dueDate instanceof DateTime && DateTime.isAfter(this.dueDate, DateTime.now())) {
      return false;
    }
    return true;
  }

  public setStarted(key: string): void {
    if(this.isArchived()) throw new CannotModifyArchivedTasks(super.getID());
    if(this.isCompleted()) throw new InvalidOperation('Cannot start a completed task');
    this.isStarted = true;
    this.addEvent(new TaskStarted(key, DateTime.now(), this.getIdProject(), super.getID()));
  }

  public setOverDue(key: string): void { 
    if(this.isArchived()) throw new CannotModifyArchivedTasks(super.getID());
    if(this.isCompleted()) throw new InvalidOperation('Cannot start a completed task');
    this.isOverdue = true;
    this.addEvent(new TaskOverDue(key, DateTime.now(), this.getIdProject(), super.getID()));
  }

  public getIdProject(): IdEntity {
    return super.getOwner() as IdEntity;
  }

  public getTitle(): TaskTitle {
    return this.title;
  }

  public getListContainer(): IdEntity {
    return this.listContainer;
  }

  public getState(): TaskState {
    return this.state;
  }

  public getDescription(): Text | None {
    return this.description;
  }

  public getStartDate(): DateTime | None {
    return this.startDate;
  }

  public getDueDate(): DateTime | None {
    return this.dueDate;
  }

  public getCategories(): Collection {
    return this.categories;
  }

  public getAssigned(): Collection {
    return this.assigned;
  }

  public getIsStarted(): boolean {
    return this.isStarted;
  }

  public getIsOverdue(): boolean {
    return this.isOverdue;
  }

  public toPrimitives(): TaskParams {
    return {
      title: this.title.getTitle(),
      listContainer: this.listContainer.getID(),
      positionInList: this.positionInList.getValue(),
      state: this.state.getState(),
      archived: this.archived,
      id: super.getID().getID(),
      idProject: (super.getOwner() as IdEntity).getID(),
      categories: this.categories.getPrimitives(),
      assigned: this.assigned.getPrimitives(),
      description: (this.description instanceof None) ? null : (this.description as Text).getText(),
      startDate: this.startDate instanceof DateTime ? this.startDate.getDate() : null,
      isOverdue: this.isOverdue,
      isStarted: this.isStarted,
      dueDate: this.dueDate instanceof DateTime ? this.dueDate.getDate() : null,
      version: super.getVersion().valueOf(),
      deletedAt: super.getDeletedAt().toPrimitive(),
    };
  }
}
