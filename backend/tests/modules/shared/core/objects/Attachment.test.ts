import LimitExceeded from "../../../../../src/modules/shared/core/errors/LimitExceeded";
import Attachment from "../../../../../src/modules/shared/core/objects/Attachment";
import IntNumber from "../../../../../src/modules/shared/core/objects/IntNumber";
import Text from "../../../../../src/modules/shared/core/objects/Text";
import Url from "../../../../../src/modules/shared/core/objects/URL";
import { AllowedAttachments } from "../../../../../src/modules/shared/core/types/AllowedAttachment.types";
import { describe, it, expect } from 'vitest';

describe('Attachment object tests', () => {
    const validUrl = new Url('http://localhost.com');

    it('Should create a valid instance of Attachment', () => {
        
        const attachment = new Attachment(validUrl, AllowedAttachments.jpeg, new Text('myImage'), new IntNumber(220));
        expect(attachment).toBeInstanceOf(Attachment);
    });

    it('Should throw if the attachment is not valid', () => {
        expect(() => new Attachment(validUrl, 'img' as AllowedAttachments, new Text('MyDoc'), new IntNumber(44444))).toThrow(LimitExceeded);
        expect(() => new Attachment(validUrl, 'another' as AllowedAttachments, new Text('MyDoc'), new IntNumber(2222))).toThrow(LimitExceeded);
    });
});
