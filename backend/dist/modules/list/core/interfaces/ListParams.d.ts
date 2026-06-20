import type TaskList from "../object/TaskList";
export default interface ListParams {
    id: string;
    title: string;
    position: number;
    archived: boolean;
    tasks: TaskList[];
    projectId: string;
    deletedAt: Date | null;
}
//# sourceMappingURL=ListParams.d.ts.map