import { AllowedAttachments } from '../types/AllowedAttachment.types';
import type Text from './Text';
import type Url from './URL';
import type IntNumber from './IntNumber';
import ValueObject from './ValueObject';
export default class Attachment extends ValueObject {
    private static readonly image;
    private url;
    private type;
    private name;
    private size;
    constructor(url: Url, type: AllowedAttachments, name: Text, size: IntNumber);
    static isImage(imageUrl: Attachment): boolean;
    getUrl(): Url;
    getType(): AllowedAttachments;
    getName(): Text;
    getSize(): IntNumber;
}
//# sourceMappingURL=Attachment.d.ts.map