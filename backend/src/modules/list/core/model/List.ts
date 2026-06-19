import ListId from "../object/ListId";
import Text from "../../../shared/core/objects/Text";
import Entity from "../../../shared/core/model/Entity";
import DeletedAt from "../../../shared/core/objects/DeletedAt";
import IdEntity from "../../../shared/core/objects/IdEntity";
import type ListParams from "../interfaces/ListParams";
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
import PositiveInteger from "../../../shared/core/objects/PositiveInteger"
import TaskList from "../object/TaskList";

export default class List extends Entity{
    private readonly id!: ListId;
    private title!: ListTitle ;
    private position!: PositiveInteger;
    private archived: boolean = false;
    private tasks!: TaskList[];
    private projectId!: IdEntity;

    private constructor(
        id: ListId,
        title: ListTitle,
        position: PositiveInteger,
        tasks: TaskList[],
        projectId: IdEntity
    ){
        super(id);
        this.id = id;
        this.title = title;
        this.position = position;
        this.tasks  = tasks;
        this.projectId = projectId;
    }

    public static create(
        id: ListId,
        title: ListTitle,
        position: PositiveInteger,
        tasks: TaskList[],
        projectId: IdEntity
    ){
        const list = new List(id, title, position, tasks, projectId);
        list.create();
        return list;
    }

    public static fromPrimitives(params: ListParams): List{

        const list = new List(
            new ListId(params.id),
            new ListTitle(new Text(params.title)),
            new PositiveInteger(params.position),
            params.tasks,
            new IdEntity(params.projectId)
        );
        list.build(DeletedAt.createFromPrimitive(params.deletedAt));
        return list;
    }

    public static exportBetweenLists(from: List, to: List, taskList: TaskList){
        from.removeTask(taskList);
        to.addTask(taskList);
    }

    //mutable actions 
    public updateTitle(newTitle: ListTitle, key: string, actor: IdEntity): void{
        if(this.archived)throw new CannotModifyArchivedList({listId: this.getID().getID()});
        this.title = newTitle;
        this.addEvent(new ListTitleUpdated(key, DateTime.now(), actor, this.projectId, this.id, newTitle.getValue()));
    }

    public move(newPosition: PositiveInteger, key: string, actor: IdEntity): void{
        if(this.archived)throw new CannotModifyArchivedList({listId: this.getID().getID()});
        this.position = newPosition;
        this.addEvent(new ListMoved(key, DateTime.now(), actor, this.projectId, this.id, newPosition));
    }

    public export(newProject: IdEntity, newPosition: PositiveInteger, key: string, actor: IdEntity): void{
        this.projectId = newProject;
        this.position = newPosition;
        this.tasks.forEach(t => {
            t.project = newProject;
        });
        this.addEvent(new ListExported(key, DateTime.now(), actor, newProject, this.id, newPosition));
    }

    public archive(key: string, actor: IdEntity): void{
        this.archived = true;
        this.addEvent(new ListArchived(key, DateTime.now(), actor, this.projectId, this.id));
    }

    public unarchive(key: string, actor: IdEntity): void{
        this.archived = false;
        this.addEvent(new ListUnarchived(key, DateTime.now(), actor, this.projectId, this.id));
    }

    public delete(key: string, actor: IdEntity): void{
        if(!this.archived) throw new InvalidOperation(`List must be archived before being delete`, {listID:this.getID().getID()});
        this.addEvent(new ListDeleted(key, DateTime.now(), actor, this.projectId, this.id));
        super.softDelete();
    }

    //validations
    public addTask(taskList: TaskList): void{
        if(this.archived)throw new CannotModifyArchivedList({listId: this.getID().getID()});

        if(taskList.position.getValue()  > this.tasks.length + 1 || 
            taskList.position.getValue() <= 0)throw new InvalidPositionInList({positionToInsert: taskList.position.getValue(), listId: this.getID().getID()});
        const part1 = this.tasks.slice(0, taskList.position.getValue() - 1);
        const part2 = this.tasks.slice(taskList.position.getValue() -1);
        part2.forEach(t => t.position = new PositiveInteger(t.position.getValue() + 1));
        this.tasks = [...part1, taskList, ...part2];
    }

    public removeTask(taskList: TaskList): void{
        if(this.archived)throw new CannotModifyArchivedList({listId: this.getID().getID()});
        
        if(!this.tasks.find(t => t.id.getID() === taskList.id.getID())) throw new ResourceNotFound(
                        `The taskList with id: ${taskList.id.getID()} does not exists in list with id: ${this.getID()}`, 
                        {
                            taskListId: taskList.id.getID(), 
                            listId: this.getID().getID()
                        });
        this.tasks = this.tasks.filter(t => t.id.getID() !== taskList.id.getID());
        for(let i = taskList.position.getValue() - 1; i < this.tasks.length; i++){
            const nextTaskList = this.tasks[i] as TaskList;
            nextTaskList.position = new PositiveInteger(nextTaskList.position.getValue() - 1);
        }
    }

    //getters
    public getTitle(): ListTitle{
        return this.title;
    }

    public getPosition(): PositiveInteger{
        return this.position;
    }

    public getTasks(): TaskList[]{
        return [...this.tasks];
    }

    public isArchived(): boolean{
        return this.archived;
    }

    public getProjectId(): IdEntity {
        return this.projectId;
    }

    public toPrimitives(): ListParams{
        return {
            id: this.id.toString(),
            title: this.title.getValue().toString(),
            position: this.position.getValue(),
            archived: this.archived,
            tasks: this.tasks,
            projectId: this.projectId.getID(),
            deletedAt: this.getDeletedAt().toPrimitive()
        }
    }
}
