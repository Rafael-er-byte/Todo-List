import InvalidParameters from '../errors/InvalidParameters';
import { ALLOWED_ATTACHMENTS, AllowedAttachments } from '../types/AllowedAttachment.types';
import type Text from './Text';
import type Url from './URL';
import type IntNumber from './IntNumber';
import ValueObject from './ValueObject';
import { ATTACHMENT_MB_LIMIT_SIZE } from '../../constants/AttachmentMbLimitSize';
import LimitExceeded from '../errors/LimitExceeded';

export default class Attachment extends ValueObject {
  private static readonly image: AllowedAttachments[] = [AllowedAttachments.jpeg, AllowedAttachments.jpg, AllowedAttachments.png];
  private url!: Url;
  private type!: AllowedAttachments;
  private name!: Text;
  private size!: IntNumber;

  constructor(url: Url, type: AllowedAttachments, name: Text, size: IntNumber) {
    super();

    if(size.getValue() > ATTACHMENT_MB_LIMIT_SIZE) throw new LimitExceeded('Attachment too large');
    if (!ALLOWED_ATTACHMENTS.includes(type))
      throw new InvalidParameters('Attachment not supported');
    try {
      this.url = url;
      this.type = type;
      this.name = name;
      this.size = size;
    } catch (err) {
      throw new InvalidParameters('Some parameters are missing', err);
    }
  }

  public static isImage(imageUrl: Attachment): boolean{
    return this.image.includes(imageUrl.getType());
  }

  public getUrl(): Url {
    return this.url;
  }

  public getType(): AllowedAttachments {
    return this.type;
  }

  public getName(): Text {
    return this.name;
  }

  public getSize(): IntNumber {
    return this.size;
  }
}
