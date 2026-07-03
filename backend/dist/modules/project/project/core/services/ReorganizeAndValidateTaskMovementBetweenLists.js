import Task from "../../../task/core/model/Task";
import FromTaskToTaskEntry from "./helper/FromTaskToTaskEntry";
export default function ReorganizeAndValidateTaskMovementBetweenLists(from, to, task) {
    const entry = FromTaskToTaskEntry(task);
    from.removeTask(entry);
    to.addTask(entry);
}
//# sourceMappingURL=ReorganizeAndValidateTaskMovementBetweenLists.js.map