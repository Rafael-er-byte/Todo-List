import type List from "../../../list/core/model/List";
import Task from "../../../task/core/model/Task";

export default function ReorganizeAndValidateTaskMovementBetweenLists(from: List, to: List, task: Task): void{
    const entry = {
        id: task.getID(),
        position: task.getPositionInList(),
        project: task.getIdProject(),
        archivedByList: task.isAvailable()
    };
    
    from.removeTask(entry);
    to.addTask(entry);
}
