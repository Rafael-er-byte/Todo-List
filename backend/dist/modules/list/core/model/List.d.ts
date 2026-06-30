import Entity from "../../../shared/core/model/Entity";
import IdEntity from "../../../shared/core/objects/IdEntity";
import type ListParams from "../interfaces/ListParams";
import ListTitle from "../object/ListTitle";
import PositiveInteger from "../../../shared/core/objects/PositiveInteger";
import TaskList from "../object/TaskList";
export default class List extends Entity {
    private readonly id;
    private title;
    private position;
    private archived;
    private tasks;
    private projectId;
    private constructor();
    static create(params: Pick<ListParams, 'id' | 'title' | 'position' | 'tasks' | 'projectId'>): List;
    static fromPrimitives(params: ListParams): List;
    static exportBetweenLists(from: List, to: List, taskList: TaskList): void;
    updateTitle(newTitle: ListTitle, key: string, actor: IdEntity): void;
    move(newPosition: PositiveInteger, key: string, actor: IdEntity): void;
    export(newProject: IdEntity, newPosition: PositiveInteger, key: string, actor: IdEntity): void;
    archive(key: string, actor: IdEntity): void;
    unarchive(key: string, actor: IdEntity): void;
    delete(key: string, actor: IdEntity): void;
    addTask(taskList: TaskList): void;
    removeTask(taskList: TaskList): void;
    getTitle(): ListTitle;
    getPosition(): PositiveInteger;
    getTasks(): TaskList[];
    isArchived(): boolean;
    getProjectId(): IdEntity;
    private ensureCanBeModified;
    toPrimitives(): ListParams;
}
//# sourceMappingURL=List.d.ts.map