import ListId from "../object/ListId";
import Text from "../../../shared/core/objects/Text";
import Entity from "../../../shared/core/model/Entity";
import IdEntity from "../../../shared/core/objects/IdEntity";
import ListTitleUpdated from "../events/ListTitleUpdated";
import DateTime from "../../../shared/core/objects/DateTime";
import ListTitle from "../object/ListTitle";
import ListMoved from "../events/ListMoved";
import ListExported from "../events/ListExported";
import ListArchived from "../events/ListArchived";
import ListUnarchived from "../events/ListUnarchived";
import ListDeleted from "../events/ListDeleted";
import ResourceNotFound from "../../../shared/core/errors/ResourceNotFound";
import InvalidOperation from "../../../shared/core/errors/InvalidOperation";
import CannotModifyArchivedList from "../errors/CannotModifyArchivedList";
import InvalidPositionInList from "../errors/InvalidPositionInList";
import PositiveInteger from "../../../shared/core/objects/PositiveInteger";
import TaskList from "../object/TaskList";
export default class List extends Entity {
    constructor(id, title, position, tasks, projectId) {
        super(id);
        this.archived = false;
        this.id = id;
        this.title = title;
        this.position = position;
        this.tasks = tasks;
        this.projectId = projectId;
    }
    static create(id, title, position, tasks, projectId) {
        const list = new List(id, title, position, tasks, projectId);
        return list;
    }
    static fromPrimitives(params) {
        const list = new List(new ListId(params.id), new ListTitle(new Text(params.title)), new PositiveInteger(params.position), params.tasks, new IdEntity(params.projectId));
        return list;
    }
    static exportBetweenLists(from, to, taskList) {
        from.removeTask(taskList);
        to.addTask(taskList);
    }
    //mutable actions 
    updateTitle(newTitle, key, actor) {
        this.ensureCanBeModified();
        this.title = newTitle;
        this.addEvent(new ListTitleUpdated(key, DateTime.now(), actor, this.projectId, this.id, newTitle.getValue()));
    }
    move(newPosition, key, actor) {
        this.ensureCanBeModified();
        this.position = newPosition;
        this.addEvent(new ListMoved(key, DateTime.now(), actor, this.projectId, this.id, newPosition));
    }
    export(newProject, newPosition, key, actor) {
        this.projectId = newProject;
        this.position = newPosition;
        this.tasks.forEach(t => {
            t.project = newProject;
        });
        this.addEvent(new ListExported(key, DateTime.now(), actor, newProject, this.id, newPosition));
    }
    archive(key, actor) {
        this.archived = true;
        this.addEvent(new ListArchived(key, DateTime.now(), actor, this.projectId, this.id));
    }
    unarchive(key, actor) {
        this.archived = false;
        this.addEvent(new ListUnarchived(key, DateTime.now(), actor, this.projectId, this.id));
    }
    delete(key, actor) {
        if (!this.archived)
            throw new InvalidOperation(`List must be archived before being delete`, { listID: this.getID().getID() });
        this.addEvent(new ListDeleted(key, DateTime.now(), actor, this.projectId, this.id));
    }
    //validations
    addTask(taskList) {
        this.ensureCanBeModified();
        if (taskList.position.getValue() > this.tasks.length + 1 ||
            taskList.position.getValue() <= 0)
            throw new InvalidPositionInList({ positionToInsert: taskList.position.getValue(), listId: this.getID().getID() });
        const part1 = this.tasks.slice(0, taskList.position.getValue() - 1);
        const part2 = this.tasks.slice(taskList.position.getValue() - 1);
        part2.forEach(t => t.position = new PositiveInteger(t.position.getValue() + 1));
        this.tasks = [...part1, taskList, ...part2];
    }
    removeTask(taskList) {
        this.ensureCanBeModified();
        if (!this.tasks.find(t => t.id.getID() === taskList.id.getID()))
            throw new ResourceNotFound(`The taskList with id: ${taskList.id.getID()} does not exists in list with id: ${this.getID()}`, {
                taskListId: taskList.id.getID(),
                listId: this.getID().getID()
            });
        this.tasks = this.tasks.filter(t => t.id.getID() !== taskList.id.getID());
        for (let i = taskList.position.getValue() - 1; i < this.tasks.length; i++) {
            const nextTaskList = this.tasks[i];
            nextTaskList.position = new PositiveInteger(nextTaskList.position.getValue() - 1);
        }
    }
    //getters
    getTitle() {
        return this.title;
    }
    getPosition() {
        return this.position;
    }
    getTasks() {
        return [...this.tasks];
    }
    isArchived() {
        return this.archived;
    }
    getProjectId() {
        return this.projectId;
    }
    ensureCanBeModified() {
        if (this.archived)
            throw new CannotModifyArchivedList({ listId: this.getID().getID() });
    }
    toPrimitives() {
        return {
            id: this.id.toString(),
            title: this.title.getValue().toString(),
            position: this.position.getValue(),
            archived: this.archived,
            tasks: this.tasks,
            projectId: this.projectId.getID()
        };
    }
}
//# sourceMappingURL=List.js.map