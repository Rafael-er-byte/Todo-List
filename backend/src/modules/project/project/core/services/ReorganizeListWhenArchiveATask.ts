import type List from "../../../list/core/model/List";
import type Task from "../../../task/core/model/Task";
import FromTaskToTaskEntry from "./helper/FromTaskToTaskEntry";

export default function ReorganizeListWhenArchiveATask(task: Task, list: List): void{
    const entry = FromTaskToTaskEntry(task);
    list.removeTask(entry);
}
