import type Task from "../../../task/core/model/Task"

export default interface ListParams{
    id: string,
    title: string,
    position: number,
    archived: boolean,
    tasks: Task[],
    projectId: string,
    version: number,
    deletedAt: Date | null
}
