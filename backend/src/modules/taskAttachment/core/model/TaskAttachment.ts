import Entity from '../../../shared/core/model/Entity';
import DateTime from '../../../shared/core/objects/DateTime';
import IdEntity from '../../../shared/core/objects/IdEntity';
import DeletedAt from '../../../shared/core/objects/DeletedAt';
import Attachment from '../../../shared/core/objects/Attachment';
import Url from '../../../shared/core/objects/URL';
import Text from '../../../shared/core/objects/Text';
import IntNumber from '../../../shared/core/objects/IntNumber';
import TaskAttachmentCreated from '../events/TaskAttachmentCreated';
import TaskAttachmentNameChanged from '../events/TaskAttachmentNameChanged';
import TaskAttachmentDeleted from '../events/TaskAttachmentDeleted';
import TaskAttachmentId from '../objects/TaskAttachmentId';
import type TaskAttachmentParams from '../interface/TaskAttachmentParams';
import type { AllowedAttachments } from '../../../shared/core/types/AllowedAttachment.types';

export default class TaskAttachment extends Entity {
  private attachment!: Attachment;

  private constructor(attachment: Attachment, id: TaskAttachmentId, taskId: IdEntity) {
    super(id, taskId);
    this.attachment = attachment;
  }

  public static create(
    attachment: Attachment,
    id: TaskAttachmentId,
    taskId: IdEntity,
    actor: IdEntity,
    key: string,
  ): TaskAttachment {
    const taskAttachment = new TaskAttachment(attachment, id, taskId);
    taskAttachment.create();
    taskAttachment.addEvent(
      new TaskAttachmentCreated(
        key,
        DateTime.now(),
        actor,
        taskId,
        taskAttachment.getID(),
        attachment,
      ),
    );

    return taskAttachment;
  }

  public static fromPrimitives(params: TaskAttachmentParams): TaskAttachment {
    const taskAttachment = new TaskAttachment(
      new Attachment(
        new Url(params.attachment.url),
        params.attachment.type as AllowedAttachments,
        new Text(params.attachment.name),
        new IntNumber(params.attachment.size),
      ),
      new TaskAttachmentId(params.id),
      new IdEntity(params.idTask),
    );

    taskAttachment.build(DeletedAt.createFromPrimitive(params.deletedAt));
    return taskAttachment;
  }

  public changeName(name: Text, actor: IdEntity, key: string): void {
    this.attachment = new Attachment(
      this.attachment.getUrl(),
      this.attachment.getType(),
      name,
      this.attachment.getSize(),
    );
    this.addEvent(
      new TaskAttachmentNameChanged(
        key,
        DateTime.now(),
        actor,
        this.getTaskId(),
        super.getID(),
        name,
      ),
    );
  }

  public delete(actor: IdEntity, key: string): void {
    this.addEvent(new TaskAttachmentDeleted(key, DateTime.now(), actor, this.getTaskId(), super.getID()));
    super.softDelete();
  }

  public getAttachment(): Attachment {
    return this.attachment;
  }

  public getUrl(): Url {
    return this.attachment.getUrl();
  }

  public getType(): AllowedAttachments {
    return this.attachment.getType();
  }

  public getName(): Text {
    return this.attachment.getName();
  }

  public getSize(): IntNumber {
    return this.attachment.getSize();
  }

  public getTaskId(): IdEntity {
    return super.getOwner() as IdEntity;
  }

  public toPrimitives(): TaskAttachmentParams {
    return {
      id: super.getID().getID(),
      idTask: this.getTaskId().getID(),
      attachment: {
        url: this.attachment.getUrl().getUrl(),
        type: this.attachment.getType(),
        name: this.attachment.getName().getText(),
        size: this.attachment.getSize().getValue(),
      },
      deletedAt: super.getDeletedAt().toPrimitive(),
    };
  }
}
