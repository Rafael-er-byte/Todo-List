export default interface CommentParams {
  id: string;
  creator: string;
  idTask: string;
  content: string;
  mentions: string[];
  version: number;
  deletedAt: Date | null;
}
