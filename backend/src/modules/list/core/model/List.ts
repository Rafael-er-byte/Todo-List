import ListId from "../object/ListId";
import Text from "../../../shared/core/objects/Text";
import IntNumber from "../../../shared/core/objects/IntNumber";
import Entity from "../../../shared/core/model/Entity";
import DeletedAt from "../../../shared/core/objects/DeletedAt";
import Version from "../../../shared/core/objects/Version";
import IdEntity from "../../../shared/core/objects/IdEntity";
import Task from "../../../task/core/model/Task";
import None from "../../../shared/core/objects/None";
import type ListParams from "../interfaces/ListParams";
import ListTitleUpdated from "../events/ListTitleUpdated";
import DateTime from "../../../shared/core/objects/DateTime";
import ListTitle from "../object/ListTitle";
import ListMoved from "../events/ListMoved";
import ListExported from "../events/ListExported";
import ResourceNotFound from "../../../shared/core/errors/ResourceNotFound";
import InvalidOperation from "../../../shared/core/errors/InvalidOperation";
import CannotModifyArchivedList from "../errors/CannotModifyArchivedList";

export default class List extends Entity{
    private readonly id!: ListId;
    private title!: ListTitle ;
    private position!: IntNumber;
    private archived: boolean = false;
    private tasks!: Task[];

    private constructor(
        id: ListId,
        title: ListTitle,
        position: IntNumber,
        tasks: Task[],
        projectId: IdEntity
    ){
        super(id, projectId);
        this.id = id;
        this.title = title;
        this.position = position;
        this.tasks  = tasks;
    }

    public static create(
        id: ListId,
        title: ListTitle,
        position: IntNumber,
        tasks: Task[],
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
            new IntNumber(params.position),
            params.tasks,
            new IdEntity(params.projectId)
        );
        list.build(new Version(params.version), DeletedAt.createFromPrimitive(params.deletedAt));
        return list;
    }

    public static exportBetweenLists(from: List, to: List, task: Task){
        from.removeTask(task);
        to.addTask(task);
    }

    public updateTitle(newTitle: ListTitle, key: string, actor: IdEntity): void{
        if(this.archived)throw new CannotModifyArchivedList({listId: this.getID().getID()});
        this.title = newTitle;
        this.addEvent(new ListTitleUpdated(key, DateTime.now(), actor, super.getOwner() as IdEntity, this.id, newTitle.getValue()));
    }

    public move(newPosition: IntNumber, key: string, actor: IdEntity): void{
        if(this.archived)throw new CannotModifyArchivedList({listId: this.getID().getID()});
        this.position = newPosition;
        this.addEvent(new ListMoved(key, DateTime.now(), actor, super.getOwner() as IdEntity, this.id, newPosition));
    }

    public export(newProject: IdEntity, newPosition: IntNumber, key: string, actor: IdEntity): void{
        super.changeOwner(newProject);
        this.position = newPosition;
        if(!(this.tasks instanceof None)){
            (this.tasks as Task[]).forEach(task => task.changeOwner(newProject));
        }
        this.addEvent(new ListExported(key, DateTime.now(), actor, newProject, this.id, newPosition));
    }

    public addTask(task: Task): void{
        if(this.archived)throw new CannotModifyArchivedList({listId: this.getID().getID()});
        if(this.tasks instanceof None){
            this.tasks = [task];
        }else{
            let part1 = this.tasks.slice(0, task.getPositionInList().getValue());
            let part2 = this.tasks.slice(task.getPositionInList().getValue());
            part2.forEach(t => t.updatePosition(new IntNumber(t.getPositionInList().getValue() + 1)));
            this.tasks = [...part1, task, ...part2];
        }
    }

    public archive(): void{
        this.archived = true;
        (this.tasks as Task[]).forEach(task => {
            task.archiveByOther();
        });
    }

    public unarvhive(): void{
        this.archived = false;
        (this.tasks as Task[]).forEach(task => {
            task.unarchiveByOther();
        });
    }

    public delete(): void{
        if(!this.archived) throw new InvalidOperation(`List must be archived before being delete`, {listID:this.getID().getID()});
        (this.tasks as Task[]).forEach(task => {
            task.deleteByOther();
        });
        super.softDelete();
    }

    public removeTask(task: Task): void{
        if(this.archived)throw new CannotModifyArchivedList({listId: this.getID().getID()});
        if(this.tasks instanceof None){
            throw new ResourceNotFound(
                    `The task with id: ${task.getID().getID()} does not exists in list with id: ${this.getID()}`, 
                    {
                        taskId: task.getID().getID(), 
                        listId: this.getID().getID()
                    });
        }else{
            if(!this.tasks.find(t => t.getID().getID() === task.getID().getID())) throw new ResourceNotFound(
                            `The task with id: ${task.getID().getID()} does not exists in list with id: ${this.getID()}`, 
                            {
                                taskId: task.getID().getID(), 
                                listId: this.getID().getID()
                            });
            this.tasks = this.tasks.filter(t => t.getID().getID() === task.getID().getID());
        }
    }

    public toPrimitives(): ListParams{
        return {
            id: this.id.toString(),
            title: this.title.getValue().toString(),
            position: this.position.getValue(),
            archived: this.archived,
            tasks: this.tasks,
            projectId: this.getOwner().toString(),
            version: this.getVersion().valueOf(),
            deletedAt: this.getDeletedAt().toPrimitive()
        }
    }
}
