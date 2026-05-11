export default interface CommentParams {
  id: string;
  creator: string;
  content: string;
  mentions: string[];
  version: number;
  deletedAt: Date | null;
  internalId: number | null;
}
