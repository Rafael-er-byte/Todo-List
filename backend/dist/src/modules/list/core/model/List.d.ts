import ListId from "../object/ListId";
import IntNumber from "../../../shared/core/objects/IntNumber";
import Entity from "../../../shared/core/model/Entity";
import IdEntity from "../../../shared/core/objects/IdEntity";
import Task from "../../../task/core/model/Task";
import type ListParams from "../interfaces/ListParams";
import ListTitle from "../object/ListTitle";
export default class List extends Entity {
    private readonly id;
    private title;
    private position;
    private archived;
    private tasks;
    private constructor();
    static create(id: ListId, title: ListTitle, position: IntNumber, tasks: Task[], projectId: IdEntity, archived?: boolean): List;
    static fromPrimitives(params: ListParams): List;
    static exportBetweenLists(from: List, to: List, task: Task): void;
    updateTitle(newTitle: ListTitle, key: string, actor: IdEntity): void;
    move(newPosition: IntNumber, key: string, actor: IdEntity): void;
    export(newProject: IdEntity, newPosition: IntNumber, key: string, actor: IdEntity): void;
    addTask(task: Task): void;
    archive(key: string, actor: IdEntity): void;
    unarchive(key: string, actor: IdEntity): void;
    unarvhive(key: string, actor: IdEntity): void;
    delete(key: string, actor: IdEntity): void;
    removeTask(task: Task): void;
    getTitle(): ListTitle;
    getPosition(): IntNumber;
    getTasks(): Task[];
    toPrimitives(): ListParams;
}
//# sourceMappingURL=List.d.ts.map