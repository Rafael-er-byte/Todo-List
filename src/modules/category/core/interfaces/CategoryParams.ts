export default interface CategoryParams {
  id: string;
  projectInfo: {
    idProject: string;
    name: string;
  };
  name: string;
  color: string;
  version: number;
  deletedAt: Date | null;
}
