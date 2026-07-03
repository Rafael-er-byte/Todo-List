export default function FromTaskToTaskEntry(task) {
    return {
        id: task.getID(),
        position: task.getPositionInList(),
        project: task.getIdProject(),
        archivedByList: task.isAvailable()
    };
}
//# sourceMappingURL=FromTaskToTaskEntry.js.map