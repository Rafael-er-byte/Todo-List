import Entity from '../../../shared/core/model/Entity';
import DateTime from '../../../shared/core/objects/DateTime';
import None from '../../../shared/core/objects/None';
import TaskArchived from '../events/TaskArchived';
import TaskDescriptionUpdated from '../events/TaskDescriptionUpdated';
import TaskDueDateUpdated from '../events/TaskDueDateUpdated';
import TaskFinished from '../events/TaskFinished';
import TaskMarkedAsPending from '../events/TaskMarkedAsPending';
import TaskMoved from '../events/TaskMoved';
import TaskExported from '../events/TaskExported';
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
import Version from '../../../shared/core/objects/Version';
import DeletedAt from '../../../shared/core/objects/DeletedAt';
import Text from '../../../shared/core/objects/Text';
import Collection from '../../../shared/core/objects/Collection';
import InvalidOperation from '../../../shared/core/errors/InvalidOperation';
import TaskStarted from '../events/TaskStarted';
import TaskOverDue from '../events/TaskOverDue';
import TaskIsAlreadyArchived from '../error/TaskIsAlreadyArchived';
import CannotDeleteIndividuallyTaskArchivedByOtherEntity from '../error/CannotDeleteIndividuallyTaskArchivedByOtherEntity';
import PositiveInteger from '../../../shared/core/objects/PositiveInteger';
export default class Task extends Entity {
    constructor(title, listContainer, positionInList, state, archived, listArchived, id, idProject, description, startDate, dueDate, isOverDue, isStarted, categories, assigned) {
        super(id, idProject);
        this.archived = false;
        this.listArchived = false;
        this.startDate = new None();
        this.dueDate = new None();
        this.isStarted = false;
        this.isOverdue = false;
        this.categories = new Collection([], [], []);
        this.assigned = new Collection([], [], []);
        this.title = title;
        this.archived = archived;
        this.listArchived = listArchived;
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
    //build from primitives
    static fromPrimitives(params) {
        const categories = params.categories.map((category) => {
            return new IdEntity(category);
        });
        const assigned = params.assigned.map((assign) => {
            return new IdEntity(assign);
        });
        const task = new Task(new TaskTitle(params.title), new IdEntity(params.listContainer), new PositiveInteger(params.positionInList), TaskState.create(params.state), params.archived, params.listArchived ?? false, new TaskId(params.id), new IdEntity(params.idProject), params.description ? new Text(params.description) : new None(), params.startDate instanceof Date ? DateTime.create(params.startDate) : new None(), params.dueDate instanceof Date ? DateTime.create(params.dueDate) : new None(), params.isOverdue, params.isStarted, new Collection(categories, [], []), new Collection(assigned, [], []));
        task.build(new Version(params.version), DeletedAt.createFromPrimitive(params.deletedAt));
        return task;
    }
    //mutable methods
    static create(title, listContainer, positionInList, state, archived, id, idProject, description, startDate, dueDate, categories, assigned, actor, key) {
        const task = new Task(title, listContainer, positionInList, state, archived, false, id, idProject, description, startDate, dueDate, false, false, categories, assigned);
        task.create();
        task.addEvent(new TaskCreated(key, DateTime.now(), actor, task.getIdProject(), task.getID(), task.toPrimitives()));
        return task;
    }
    delete(actor, key) {
        if (this.listArchived)
            throw new CannotDeleteIndividuallyTaskArchivedByOtherEntity({ id: this.getID().getID() });
        if (!this.isArchived()) {
            throw new TaskNeedsToBeArchivedBeforeDeleteIt(super.getID());
        }
        this.addEvent(new TaskDeleted(key, DateTime.now(), actor, this.getIdProject(), super.getID()));
        super.softDelete();
    }
    removeCategory(category, actor, key) {
        if (this.cannotBeModified())
            throw new CannotModifyArchivedTasks(super.getID());
        this.categories = this.categories.deleteItem(category);
        this.addEvent(new TaskCategoryDeleted(key, DateTime.now(), actor, this.getIdProject(), super.getID(), category));
    }
    removeAssigned(assigned, actor, key) {
        if (this.cannotBeModified())
            throw new CannotModifyArchivedTasks(super.getID());
        this.assigned = this.assigned.deleteItem(assigned);
        this.addEvent(new TaskContributorDeleted(key, DateTime.now(), actor, this.getIdProject(), super.getID(), assigned));
    }
    move(list, positionInList, actor, key) {
        if (this.cannotBeModified())
            throw new CannotModifyArchivedTasks(super.getID());
        this.listContainer = list;
        this.positionInList = positionInList;
        this.addEvent(new TaskMoved(key, DateTime.now(), actor, this.getIdProject(), super.getID(), this.listContainer, this.positionInList));
    }
    unarchive(actor, key) {
        this.archived = false;
        this.addEvent(new TaskUnarchived(key, DateTime.now(), actor, this.getIdProject(), super.getID()));
    }
    archive(actor, key) {
        if (this.listArchived)
            throw new TaskIsAlreadyArchived({ taskId: this.getID().getID() });
        this.archived = true;
        this.addEvent(new TaskArchived(key, DateTime.now(), actor, this.getIdProject(), super.getID()));
    }
    assignMember(actor, key, assigned) {
        if (this.cannotBeModified())
            throw new CannotModifyArchivedTasks(super.getID());
        this.assigned = this.assigned.addItem(assigned);
        this.addEvent(new TaskMemberAdded(key, DateTime.now(), actor, this.getIdProject(), super.getID(), assigned));
    }
    updateStartDate(date, actor, key) {
        if (this.cannotBeModified())
            throw new CannotModifyArchivedTasks(super.getID());
        if (this.dueDate instanceof DateTime) {
            if (!DateTime.isBefore(date, this.dueDate)) {
                throw new InvalidStartDate({ startDate: date, dueDate: this.dueDate });
            }
        }
        this.startDate = date;
        this.addEvent(new TaskBeginDateUpdated(key, DateTime.now(), actor, this.getIdProject(), super.getID(), this.startDate));
    }
    updateDueDate(date, actor, key) {
        if (this.cannotBeModified())
            throw new CannotModifyArchivedTasks(super.getID());
        if (this.startDate instanceof DateTime) {
            if (!DateTime.isAfter(date, this.startDate)) {
                throw new InvalidDueDate({ dueDate: date, startDate: this.startDate });
            }
        }
        this.dueDate = date;
        this.addEvent(new TaskDueDateUpdated(key, DateTime.now(), actor, this.getIdProject(), super.getID(), this.dueDate));
    }
    updateTitle(title, actor, key) {
        if (this.cannotBeModified())
            throw new CannotModifyArchivedTasks(super.getID());
        this.title = title;
        this.addEvent(new TitleUpdated(key, DateTime.now(), actor, this.getIdProject(), super.getID(), this.title));
    }
    updateDescription(description, actor, key) {
        if (this.cannotBeModified())
            throw new CannotModifyArchivedTasks(super.getID());
        this.description = description;
        this.addEvent(new TaskDescriptionUpdated(key, DateTime.now(), actor, this.getIdProject(), super.getID(), description));
    }
    addCategory(category, actor, key) {
        if (this.cannotBeModified())
            throw new CannotModifyArchivedTasks(super.getID());
        this.categories = this.categories.addItem(category);
        this.addEvent(new TaskCategoryAdded(key, DateTime.now(), actor, this.getIdProject(), super.getID(), category));
    }
    markAsFinished(actor, key) {
        if (this.cannotBeModified())
            throw new CannotModifyArchivedTasks(super.getID());
        if (this.state.isCompleted())
            return;
        this.state = TaskState.completed();
        this.addEvent(new TaskFinished(key, DateTime.now(), actor, this.getIdProject(), super.getID()));
    }
    markAsPending(actor, key) {
        if (this.cannotBeModified())
            throw new CannotModifyArchivedTasks(super.getID());
        if (!this.state.isCompleted())
            return;
        this.state = TaskState.pending();
        this.addEvent(new TaskMarkedAsPending(key, DateTime.now(), actor, this.getIdProject(), super.getID()));
    }
    exportToProject(newProject, idList, positionInList, actor, key) {
        if (this.cannotBeModified())
            throw new CannotModifyArchivedTasks(super.getID());
        this.listContainer = idList;
        this.positionInList = positionInList;
        super.changeOwner(newProject);
        this.addEvent(new TaskExported(key, DateTime.now(), actor, newProject, super.getID(), idList, positionInList));
    }
    setStarted(key) {
        if (this.cannotBeModified())
            throw new CannotModifyArchivedTasks(super.getID());
        if (this.isCompleted())
            throw new InvalidOperation('Cannot start a completed task');
        this.isStarted = true;
        this.addEvent(new TaskStarted(key, DateTime.now(), this.getIdProject(), super.getID()));
    }
    setOverDue(key) {
        if (this.cannotBeModified())
            throw new CannotModifyArchivedTasks(super.getID());
        if (this.isCompleted())
            throw new InvalidOperation('Cannot start a completed task');
        this.isOverdue = true;
        this.addEvent(new TaskOverDue(key, DateTime.now(), this.getIdProject(), super.getID()));
    }
    //mutable methods accesible for another classes
    updatePosition(positionInList) {
        this.positionInList = positionInList;
    }
    archiveByOther() {
        this.listArchived = true;
    }
    unarchiveByOther() {
        this.listArchived = false;
    }
    deleteByOther() {
        super.softDelete();
    }
    //getters
    isArchived() {
        return this.archived;
    }
    cannotBeModified() {
        return this.archived || this.listArchived;
    }
    isCompleted() {
        return this.state.isCompleted();
    }
    overDue() {
        if (this.dueDate instanceof DateTime && DateTime.isAfter(this.dueDate, DateTime.now())) {
            return false;
        }
        return true;
    }
    getIdProject() {
        return super.getOwner();
    }
    getTitle() {
        return this.title;
    }
    getListContainer() {
        return this.listContainer;
    }
    getState() {
        return this.state;
    }
    getDescription() {
        return this.description;
    }
    getStartDate() {
        return this.startDate;
    }
    getDueDate() {
        return this.dueDate;
    }
    getCategories() {
        return this.categories;
    }
    getAssigned() {
        return this.assigned;
    }
    getIsStarted() {
        return this.isStarted;
    }
    getIsOverdue() {
        return this.isOverdue;
    }
    getPositionInList() {
        return this.positionInList;
    }
    isArchivedByList() {
        return this.listArchived;
    }
    toPrimitives() {
        return {
            title: this.title.getTitle(),
            listContainer: this.listContainer.getID(),
            positionInList: this.positionInList.getValue(),
            state: this.state.getState(),
            archived: this.archived,
            listArchived: this.listArchived,
            id: super.getID().getID(),
            idProject: super.getOwner().getID(),
            categories: this.categories.getPrimitives(),
            assigned: this.assigned.getPrimitives(),
            description: (this.description instanceof None) ? null : this.description.getText(),
            startDate: this.startDate instanceof DateTime ? this.startDate.getDate() : null,
            isOverdue: this.isOverdue,
            isStarted: this.isStarted,
            dueDate: this.dueDate instanceof DateTime ? this.dueDate.getDate() : null,
            version: super.getVersion().valueOf(),
            deletedAt: super.getDeletedAt().toPrimitive(),
        };
    }
}
//# sourceMappingURL=Task.js.map