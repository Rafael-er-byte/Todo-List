export default class MemberRules {
  private static MAX_NAME_SIZE: number = 255;
  private static ATTACHMENT_TYPE: string = 'IMAGE';
  private static MAX_ATTACHMENT_MB_SIZE: number = 250;

  public static maxNameSize(): number {
    return this.MAX_NAME_SIZE;
  }

  public static attachmentType(): string {
    return this.ATTACHMENT_TYPE;
  }

  public static maxAttachmentMbSize(): number {
    return this.MAX_ATTACHMENT_MB_SIZE;
  }
}
