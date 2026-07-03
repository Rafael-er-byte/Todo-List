import Task from "../../../task/core/model/Task";
export default function ReorganizeAndValidateTaskMovementBetweenLists(from, to, task) {
    const entry = {
        id: task.getID(),
        position: task.getPositionInList(),
        project: task.getIdProject(),
        archivedByList: task.isAvailable()
    };
    from.removeTask(entry);
    to.addTask(entry);
}
//# sourceMappingURL=ReorganizeAndValidateTaskMovementBetweenLists.js.map