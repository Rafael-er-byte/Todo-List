import type TaskPosition from '../objects/TaskPosition';

export default interface TaskParams {
  title: string;
  position: TaskPosition;
  state: string;
  archived: boolean;
  id: string;
  idProject: string;
  assigned: string[];
  categories: string[];
  description: string | null;
  startDate: Date | null;
  dueDate: Date | null;
  idInternal: number | null;
  version: number | null;
  deletedAt: Date | null;
}
