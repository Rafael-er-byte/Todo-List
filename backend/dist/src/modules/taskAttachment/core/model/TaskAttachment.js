import Entity from '../../../shared/core/model/Entity';
import DateTime from '../../../shared/core/objects/DateTime';
import IdEntity from '../../../shared/core/objects/IdEntity';
import Version from '../../../shared/core/objects/Version';
import DeletedAt from '../../../shared/core/objects/DeletedAt';
import Attachment from '../../../shared/core/objects/Attachment';
import Url from '../../../shared/core/objects/URL';
import Text from '../../../shared/core/objects/Text';
import IntNumber from '../../../shared/core/objects/IntNumber';
import TaskAttachmentCreated from '../events/TaskAttachmentCreated';
import TaskAttachmentNameChanged from '../events/TaskAttachmentNameChanged';
import TaskAttachmentDeleted from '../events/TaskAttachmentDeleted';
import TaskAttachmentId from '../objects/TaskAttachmentId';
export default class TaskAttachment extends Entity {
    constructor(attachment, id, taskId) {
        super(id, taskId);
        this.attachment = attachment;
    }
    static create(attachment, id, taskId, actor, key) {
        const taskAttachment = new TaskAttachment(attachment, id, taskId);
        taskAttachment.create();
        taskAttachment.addEvent(new TaskAttachmentCreated(key, DateTime.now(), actor, taskId, taskAttachment.getID(), attachment));
        return taskAttachment;
    }
    static fromPrimitives(params) {
        const taskAttachment = new TaskAttachment(new Attachment(new Url(params.attachment.url), params.attachment.type, new Text(params.attachment.name), new IntNumber(params.attachment.size)), new TaskAttachmentId(params.id), new IdEntity(params.idTask));
        taskAttachment.build(new Version(params.version), DeletedAt.createFromPrimitive(params.deletedAt));
        return taskAttachment;
    }
    changeName(name, actor, key) {
        this.attachment = new Attachment(this.attachment.getUrl(), this.attachment.getType(), name, this.attachment.getSize());
        this.addEvent(new TaskAttachmentNameChanged(key, DateTime.now(), actor, this.getTaskId(), super.getID(), name));
    }
    delete(actor, key) {
        this.addEvent(new TaskAttachmentDeleted(key, DateTime.now(), actor, this.getTaskId(), super.getID()));
        super.softDelete();
    }
    getAttachment() {
        return this.attachment;
    }
    getUrl() {
        return this.attachment.getUrl();
    }
    getType() {
        return this.attachment.getType();
    }
    getName() {
        return this.attachment.getName();
    }
    getSize() {
        return this.attachment.getSize();
    }
    getTaskId() {
        return super.getOwner();
    }
    toPrimitives() {
        return {
            id: super.getID().getID(),
            idTask: this.getTaskId().getID(),
            attachment: {
                url: this.attachment.getUrl().getUrl(),
                type: this.attachment.getType(),
                name: this.attachment.getName().getText(),
                size: this.attachment.getSize().getValue(),
            },
            version: super.getVersion().valueOf(),
            deletedAt: super.getDeletedAt().toPrimitive(),
        };
    }
}
//# sourceMappingURL=TaskAttachment.js.map