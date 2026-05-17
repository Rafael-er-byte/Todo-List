export default interface TaskParams {
  title: string;
  listContainer: string;
  state: string;
  archived: boolean;
  id: string;
  idProject: string;
  assigned: string[];
  categories: string[];
  description: string | null;
  startDate: Date | null;
  dueDate: Date | null;
  isOverdue: boolean;
  isStarted: boolean;
  idInternal: number | null;
  version: number | null;
  deletedAt: Date | null;
}
