import Entity from '../../../shared/core/model/Entity';
import DateTime from '../../../shared/core/objects/DateTime';
import IdEntity from '../../../shared/core/objects/IdEntity';
import Attachment from '../../../shared/core/objects/Attachment';
import Url from '../../../shared/core/objects/URL';
import Text from '../../../shared/core/objects/Text';
import IntNumber from '../../../shared/core/objects/IntNumber';
import TaskAttachmentCreated from '../events/TaskAttachmentCreated';
import TaskAttachmentNameChanged from '../events/TaskAttachmentNameChanged';
import TaskAttachmentDeleted from '../events/TaskAttachmentDeleted';
import TaskAttachmentId from '../objects/TaskAttachmentId';
export default class TaskAttachment extends Entity {
    constructor(attachment, id, task) {
        super(id);
        this.task = task;
        this.attachment = attachment;
    }
    static create(attachment, id, task, actor, key) {
        const taskAttachment = new TaskAttachment(attachment, id, task);
        taskAttachment.addEvent(new TaskAttachmentCreated(key, DateTime.now(), actor, task, taskAttachment.getID(), attachment));
        return taskAttachment;
    }
    static fromPrimitives(params) {
        const taskAttachment = new TaskAttachment(new Attachment(new Url(params.attachment.url), params.attachment.type, new Text(params.attachment.name), new IntNumber(params.attachment.size)), new TaskAttachmentId(params.id), new IdEntity(params.idTask));
        return taskAttachment;
    }
    changeName(name, actor, key) {
        this.attachment = new Attachment(this.attachment.getUrl(), this.attachment.getType(), name, this.attachment.getSize());
        this.addEvent(new TaskAttachmentNameChanged(key, DateTime.now(), actor, this.getTask(), super.getID(), name));
    }
    delete(actor, key) {
        this.addEvent(new TaskAttachmentDeleted(key, DateTime.now(), actor, this.getTask(), super.getID()));
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
    getTask() {
        return this.task;
    }
    getTaskId() {
        return this.getTask();
    }
    toPrimitives() {
        return {
            id: super.getID().getID(),
            idTask: this.getTask().getID(),
            attachment: {
                url: this.attachment.getUrl().getUrl(),
                type: this.attachment.getType(),
                name: this.attachment.getName().getText(),
                size: this.attachment.getSize().getValue(),
            },
        };
    }
}
//# sourceMappingURL=TaskAttachment.js.map