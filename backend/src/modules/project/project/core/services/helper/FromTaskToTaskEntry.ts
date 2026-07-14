import type TaskEntry from "../../../../list/core/aggregates/TaskEntry";
import type Task from "../../../../task/core/model/Task";

export default function FromTaskToTaskEntry(task: Task): TaskEntry{
    return {
        id: task.getId(),
        position: task.getPositionInList(),
        project: task.getIdProject(),
        archivedByList: task.isAvailable()
    };
}