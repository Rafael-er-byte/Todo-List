import ListId from "../object/ListId";
import Text from "../../../shared/core/objects/Text";
import Entity from "../../../shared/core/model/Entity";
import DeletedAt from "../../../shared/core/objects/DeletedAt";
import Version from "../../../shared/core/objects/Version";
import IdEntity from "../../../shared/core/objects/IdEntity";
import Task from "../../../task/core/model/Task";
import None from "../../../shared/core/objects/None";
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
export default class List extends Entity {
    constructor(id, title, position, tasks, projectId) {
        super(id, projectId);
        this.archived = false;
        this.id = id;
        this.title = title;
        this.position = position;
        this.tasks = tasks;
    }
    static create(id, title, position, tasks, projectId) {
        const list = new List(id, title, position, tasks, projectId);
        list.create();
        return list;
    }
    static fromPrimitives(params) {
        const list = new List(new ListId(params.id), new ListTitle(new Text(params.title)), new PositiveInteger(params.position), params.tasks, new IdEntity(params.projectId));
        list.build(new Version(params.version), DeletedAt.createFromPrimitive(params.deletedAt));
        return list;
    }
    static exportBetweenLists(from, to, task) {
        from.removeTask(task);
        to.addTask(task);
    }
    //mutable actions 
    updateTitle(newTitle, key, actor) {
        if (this.archived)
            throw new CannotModifyArchivedList({ listId: this.getID().getID() });
        this.title = newTitle;
        this.addEvent(new ListTitleUpdated(key, DateTime.now(), actor, super.getOwner(), this.id, newTitle.getValue()));
    }
    move(newPosition, key, actor) {
        if (this.archived)
            throw new CannotModifyArchivedList({ listId: this.getID().getID() });
        this.position = newPosition;
        this.addEvent(new ListMoved(key, DateTime.now(), actor, super.getOwner(), this.id, newPosition));
    }
    export(newProject, newPosition, key, actor) {
        super.changeOwner(newProject);
        this.position = newPosition;
        if (!(this.tasks instanceof None)) {
            this.tasks.forEach(task => task.changeOwner(newProject));
        }
        this.addEvent(new ListExported(key, DateTime.now(), actor, newProject, this.id, newPosition));
    }
    archive(key, actor) {
        this.archived = true;
        this.tasks.forEach(task => {
            task.archiveByOther();
        });
        this.addEvent(new ListArchived(key, DateTime.now(), actor, super.getOwner(), this.id));
    }
    unarchive(key, actor) {
        this.archived = false;
        this.tasks.forEach(task => {
            task.unarchiveByOther();
        });
        this.addEvent(new ListUnarchived(key, DateTime.now(), actor, super.getOwner(), this.id));
    }
    unarvhive(key, actor) {
        this.unarchive(key, actor);
    }
    delete(key, actor) {
        if (!this.archived)
            throw new InvalidOperation(`List must be archived before being delete`, { listID: this.getID().getID() });
        this.tasks.forEach(task => {
            task.deleteByOther();
        });
        this.addEvent(new ListDeleted(key, DateTime.now(), actor, super.getOwner(), this.id));
        super.softDelete();
    }
    //validations
    addTask(task) {
        if (this.archived)
            throw new CannotModifyArchivedList({ listId: this.getID().getID() });
        if (task.getPositionInList().getValue() > this.tasks.length ||
            task.getPositionInList().getValue() < 0)
            throw new InvalidPositionInList({ positionToInsert: task.getPositionInList().getValue(), listId: this.getID().getID() });
        if (this.tasks instanceof None) {
            this.tasks = [task];
        }
        else {
            const part1 = this.tasks.slice(0, task.getPositionInList().getValue());
            const part2 = this.tasks.slice(task.getPositionInList().getValue());
            part2.forEach(t => t.updatePosition(new PositiveInteger(t.getPositionInList().getValue() + 1)));
            this.tasks = [...part1, task, ...part2];
        }
    }
    removeTask(task) {
        if (this.archived)
            throw new CannotModifyArchivedList({ listId: this.getID().getID() });
        if (this.tasks instanceof None) {
            throw new ResourceNotFound(`The task with id: ${task.getID().getID()} does not exists in list with id: ${this.getID()}`, {
                taskId: task.getID().getID(),
                listId: this.getID().getID()
            });
        }
        else {
            if (!this.tasks.find(t => t.getID().getID() === task.getID().getID()))
                throw new ResourceNotFound(`The task with id: ${task.getID().getID()} does not exists in list with id: ${this.getID()}`, {
                    taskId: task.getID().getID(),
                    listId: this.getID().getID()
                });
            this.tasks = this.tasks.filter(t => t.getID().getID() === task.getID().getID());
        }
    }
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
    toPrimitives() {
        return {
            id: this.id.toString(),
            title: this.title.getValue().toString(),
            position: this.position.getValue(),
            archived: this.archived,
            tasks: this.tasks,
            projectId: this.getOwner().toString(),
            version: this.getVersion().valueOf(),
            deletedAt: this.getDeletedAt().toPrimitive()
        };
    }
}
//# sourceMappingURL=List.js.map