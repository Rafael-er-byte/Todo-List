import ListId from "../object/ListId";
import Text from "../../../shared/core/objects/Text";
import IntNumber from "../../../shared/core/objects/IntNumber";
import Entity from "../../../shared/core/model/Entity";
import DeletedAt from "../../../shared/core/objects/DeletedAt";
import Version from "../../../shared/core/objects/Version";
import IdEntity from "../../../shared/core/objects/IdEntity";
import Task from "../../../task/core/model/Task";
import ListTitleUpdated from "../events/ListTitleUpdated";
import DateTime from "../../../shared/core/objects/DateTime";
import ListTitle from "../object/ListTitle";
import ListMoved from "../events/ListMoved";
import ListExported from "../events/ListExported";
import ResourceNotFound from "../../../shared/core/errors/ResourceNotFound";
import InvalidOperation from "../../../shared/core/errors/InvalidOperation";
import CannotModifyArchivedList from "../errors/CannotModifyArchivedList";
import ListArchived from "../events/ListArchived";
import ListUnarchived from "../events/ListUnarchived";
import ListDeleted from "../events/ListDeleted";
export default class List extends Entity {
    constructor(id, title, position, tasks, projectId, archived) {
        super(id, projectId);
        this.archived = false;
        this.id = id;
        this.title = title;
        this.position = position;
        this.tasks = tasks;
        this.archived = archived;
    }
    static create(id, title, position, tasks, projectId, archived = false) {
        const list = new List(id, title, position, tasks, projectId, archived);
        list.create();
        return list;
    }
    static fromPrimitives(params) {
        const list = new List(new ListId(params.id), new ListTitle(new Text(params.title)), new IntNumber(params.position), params.tasks ?? [], new IdEntity(params.projectId), params.archived ?? false);
        list.build(new Version(params.version), DeletedAt.createFromPrimitive(params.deletedAt));
        return list;
    }
    static exportBetweenLists(from, to, task) {
        from.removeTask(task);
        to.addTask(task);
    }
    updateTitle(newTitle, key, actor) {
        if (this.archived)
            throw new CannotModifyArchivedList({ listId: this.getID().getID() });
        this.title = newTitle;
        this.addEvent(new ListTitleUpdated(key, DateTime.now(), actor, super.getOwner(), this.id, newTitle.getValue()));
    }
    move(newPosition, key, actor) {
        this.position = newPosition;
        this.addEvent(new ListMoved(key, DateTime.now(), actor, super.getOwner(), this.id, newPosition));
    }
    export(newProject, newPosition, key, actor) {
        super.changeOwner(newProject);
        this.position = newPosition;
        this.tasks.forEach(task => task.changeOwner(newProject));
        this.addEvent(new ListExported(key, DateTime.now(), actor, newProject, this.id, newPosition));
    }
    addTask(task) {
        let part1 = this.tasks.slice(0, task.getPositionInList().getValue());
        let part2 = this.tasks.slice(task.getPositionInList().getValue());
        part2.forEach(t => t.updatePosition(new IntNumber(t.getPositionInList().getValue() + 1)));
        this.tasks = [...part1, task, ...part2];
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
    removeTask(task) {
        if (!this.tasks.find(t => t.getID().getID() === task.getID().getID()))
            throw new ResourceNotFound(`The task with id: ${task.getID().getID()} does not exists in list with id: ${this.getID()}`, {
                taskId: task.getID().getID(),
                listId: this.getID().getID()
            });
        this.tasks = this.tasks.filter(t => t.getID().getID() !== task.getID().getID());
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
    toPrimitives() {
        return {
            id: this.id.getID(),
            title: this.title.getValue().getText(),
            position: this.position.getValue(),
            archived: this.archived,
            tasks: this.tasks,
            projectId: this.getOwner().getID(),
            version: this.getVersion().valueOf(),
            deletedAt: this.getDeletedAt().toPrimitive()
        };
    }
}
//# sourceMappingURL=List.js.map