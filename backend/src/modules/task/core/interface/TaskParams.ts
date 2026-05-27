export default interface TaskParams {
  title: string;
  listContainer: string;
  positionInList: number;
  state: string;
  archived: boolean;
  listArchived: boolean;
  id: string;
  idProject: string;
  assigned: string[];
  categories: string[];
  description: string | null;
  startDate: Date | null;
  dueDate: Date | null;
  isOverdue: boolean;
  isStarted: boolean;
  version: number | null;
  deletedAt: Date | null;
}
