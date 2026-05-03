export default interface CategoryParams {
  id: string;
  idProject: string;
  name: string;
  color: string;
  version: number;
  deletedAt: Date | null;
  internalId: number;
}
