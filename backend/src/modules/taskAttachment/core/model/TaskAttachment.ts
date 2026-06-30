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
import type TaskAttachmentParams from '../interface/TaskAttachmentParams';
import type { AllowedAttachments } from '../../../shared/core/types/AllowedAttachment.types';

export default class TaskAttachment extends Entity {
  private attachment!: Attachment;
  private task!: IdEntity;

  private constructor(attachment: Attachment, id: TaskAttachmentId, task: IdEntity) {
    super(id);
    this.task = task;
    this.attachment = attachment;
  }

  public static create(
    params: TaskAttachmentParams & { actor: string; key: string },
  ): TaskAttachment {
    const attachment = new Attachment(
      new Url(params.attachment.url),
      params.attachment.type as AllowedAttachments,
      new Text(params.attachment.name),
      new IntNumber(params.attachment.size),
    );
    const id = new TaskAttachmentId(params.id);
    const task = new IdEntity(params.idTask);
    const actor = new IdEntity(params.actor);
    const taskAttachment = new TaskAttachment(attachment, id, task);
    taskAttachment.addEvent(
      new TaskAttachmentCreated(
        params.key,
        DateTime.now(),
        actor,
        task,
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
        this.getTask(),
        super.getID(),
        name,
      ),
    );
  }

  public delete(actor: IdEntity, key: string): void {
    this.addEvent(new TaskAttachmentDeleted(key, DateTime.now(), actor, this.getTask(), super.getID()));
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

  public getTask(): IdEntity {
    return this.task;
  }

  public getTaskId(): IdEntity {
    return this.getTask();
  }

  public toPrimitives(): TaskAttachmentParams {
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
