export default interface TaskAttachmentParams {
  id: string;
  idTask: string;
  attachment: {
    url: string;
    type: string;
    name: string;
    size: number;
  };
}
