import InvalidParameters from '../errors/InvalidParameters';
import { ALLOWED_ATTACHMENTS, AllowedAttachments } from '../types/AllowedAttachment.types';
import ValueObject from './ValueObject';
import { ATTACHMENT_MB_LIMIT_SIZE } from '../../constants/AttachmentMbLimitSize';
import LimitExceeded from '../errors/LimitExceeded';
class Attachment extends ValueObject {
    constructor(url, type, name, size) {
        super();
        if (size.getValue() > ATTACHMENT_MB_LIMIT_SIZE)
            throw new LimitExceeded('Attachment too large');
        if (!ALLOWED_ATTACHMENTS.includes(type))
            throw new InvalidParameters('Attachment not supported');
        try {
            this.url = url;
            this.type = type;
            this.name = name;
            this.size = size;
        }
        catch (err) {
            throw new InvalidParameters('Some parameters are missing', err);
        }
    }
    static isImage(imageUrl) {
        return this.image.includes(imageUrl.getType());
    }
    getUrl() {
        return this.url;
    }
    getType() {
        return this.type;
    }
    getName() {
        return this.name;
    }
    getSize() {
        return this.size;
    }
}
Attachment.image = [AllowedAttachments.jpeg, AllowedAttachments.jpg, AllowedAttachments.png];
export default Attachment;
//# sourceMappingURL=Attachment.js.map