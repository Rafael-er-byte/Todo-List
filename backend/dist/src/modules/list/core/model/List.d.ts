import ListId from "../object/ListId";
import Entity from "../../../shared/core/model/Entity";
import IdEntity from "../../../shared/core/objects/IdEntity";
import Task from "../../../task/core/model/Task";
import type ListParams from "../interfaces/ListParams";
import ListTitle from "../object/ListTitle";
import PositiveInteger from "../../../shared/core/objects/PositiveInteger";
export default class List extends Entity {
    private readonly id;
    private title;
    private position;
    private archived;
    private tasks;
    private projectId;
    private constructor();
    static create(id: ListId, title: ListTitle, position: PositiveInteger, tasks: Task[], projectId: IdEntity): List;
    static fromPrimitives(params: ListParams): List;
    static exportBetweenLists(from: List, to: List, task: Task): void;
    updateTitle(newTitle: ListTitle, key: string, actor: IdEntity): void;
    move(newPosition: PositiveInteger, key: string, actor: IdEntity): void;
    export(newProject: IdEntity, newPosition: PositiveInteger, key: string, actor: IdEntity): void;
    archive(key: string, actor: IdEntity): void;
    unarchive(key: string, actor: IdEntity): void;
    delete(key: string, actor: IdEntity): void;
    addTask(task: Task): void;
    removeTask(task: Task): void;
    getTitle(): ListTitle;
    getPosition(): PositiveInteger;
    getTasks(): Task[];
    isArchived(): boolean;
    getProjectId(): IdEntity;
    toPrimitives(): ListParams;
    moveByOther(newPosition: PositiveInteger): void;
}
//# sourceMappingURL=List.d.ts.map