import type List from "../../../list/core/model/List";
import Task from "../../../task/core/model/Task";
import FromTaskToTaskEntry from "./helper/FromTaskToTaskEntry";

export default function ReorganizeAndValidateTaskMovementBetweenLists(from: List, to: List, task: Task): void{
    const entry = FromTaskToTaskEntry(task);
    from.removeTask(entry);
    to.addTask(entry);
}
