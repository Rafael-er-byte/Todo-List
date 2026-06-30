import InvalidParameters from '../../../../shared/core/errors/InvalidParameters';
import Attachment from '../../../../shared/core/objects/Attachment';
import ValueObject from '../../../../shared/core/objects/ValueObject';

export default class ProjectBackGroundImage extends ValueObject {
  private image!: Attachment;

  constructor(image: Attachment) {
    super();
    if (!Attachment.isImage(image)) throw new InvalidParameters('Project background image must be an image');
    this.image = image;
  }

  public getImage(): Attachment {
    return this.image;
  }
}
