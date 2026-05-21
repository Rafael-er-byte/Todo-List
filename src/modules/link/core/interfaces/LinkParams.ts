export default interface LinkParams {
  id: string;
  idTask: string;
  url: string;
  visibleText: string | null;
  version: number;
  deletedAt: Date | null;
}
