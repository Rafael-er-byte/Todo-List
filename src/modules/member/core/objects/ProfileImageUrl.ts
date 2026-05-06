import InvalidParameters from "../../../shared/core/errors/InvalidParameters";
import Attachment from "../../../shared/core/objects/Attachment";
import ValueObject from "../../../shared/core/objects/ValueObject";

export default class ProfileImageUrl extends ValueObject{
    private attachment!: Attachment;

    constructor(attach: Attachment){
        super();
        if(!Attachment.isImage(attach))throw new InvalidParameters('Profile image must be an image');
        this.attachment = attach;
    }

    public getAttachment(): Attachment{
        return this.attachment;
    }
}
