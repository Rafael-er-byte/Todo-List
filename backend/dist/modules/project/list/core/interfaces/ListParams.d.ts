import type TaskEntry from "../aggregates/TaskEntry";
export default interface ListParams {
    id: string;
    title: string;
    position: number;
    archived: boolean;
    tasks: TaskEntry[];
    projectId: string;
}
//# sourceMappingURL=ListParams.d.ts.map