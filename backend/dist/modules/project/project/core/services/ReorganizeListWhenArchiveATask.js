import FromTaskToTaskEntry from "./helper/FromTaskToTaskEntry";
export default function ReorganizeListWhenArchiveATask(task, list) {
    const entry = FromTaskToTaskEntry(task);
    list.removeTask(entry);
}
//# sourceMappingURL=ReorganizeListWhenArchiveATask.js.map