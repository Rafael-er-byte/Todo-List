import Entity from '../../../../shared/core/model/Entity';
import IdEntity from '../../../../shared/core/objects/IdEntity';
import Attachment from '../../../../shared/core/objects/Attachment';
import Url from '../../../../shared/core/objects/URL';
import Text from '../../../../shared/core/objects/Text';
import IntNumber from '../../../../shared/core/objects/IntNumber';
import type TaskAttachmentParams from '../interface/TaskAttachmentParams';
import type { AllowedAttachments } from '../../../../shared/core/types/AllowedAttachment.types';
export default class TaskAttachment extends Entity {
    private attachment;
    private task;
    private constructor();
    static create(params: TaskAttachmentParams & {
        actor: string;
        key: string;
    }): TaskAttachment;
    static fromPrimitives(params: TaskAttachmentParams): TaskAttachment;
    changeName(name: Text, actor: IdEntity, key: string): void;
    delete(actor: IdEntity, key: string): void;
    getAttachment(): Attachment;
    getUrl(): Url;
    getType(): AllowedAttachments;
    getName(): Text;
    getSize(): IntNumber;
    getTask(): IdEntity;
    getTaskId(): IdEntity;
    toPrimitives(): TaskAttachmentParams;
}
//# sourceMappingURL=TaskAttachment.d.ts.map