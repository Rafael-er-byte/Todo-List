import { describe, it, expect } from 'vitest';
import TaskAttachment from '../../../../../src/modules/taskAttachment/core/model/TaskAttachment';
import TaskAttachmentId from '../../../../../src/modules/taskAttachment/core/objects/TaskAttachmentId';
import Attachment from '../../../../../src/modules/shared/core/objects/Attachment';
import Url from '../../../../../src/modules/shared/core/objects/URL';
import Text from '../../../../../src/modules/shared/core/objects/Text';
import IntNumber from '../../../../../src/modules/shared/core/objects/IntNumber';
import { AllowedAttachments } from '../../../../../src/modules/shared/core/types/AllowedAttachment.types';
import IdEntity from '../../../../../src/modules/shared/core/objects/IdEntity';

describe('TaskAttachment entity tests', () => {
  const validUrl = new Url('http://localhost.com/file.png');
  const validAttachment = new Attachment(validUrl, AllowedAttachments.png, new Text('file.png'), new IntNumber(128));
  const taskId = new IdEntity('4043c815-7220-7d64-8c42-6f2af4f9fd37');
  const actorId = new IdEntity('5043c815-7220-7d64-8c42-6f2af4f9fd37');
  const attachmentId = new TaskAttachmentId('6043c815-7220-7d64-8c42-6f2af4f9fd37');

  it('should create a TaskAttachment and expose attachment information', () => {
    const taskAttachment = TaskAttachment.create(validAttachment, attachmentId, taskId, actorId, 'create-key');

    expect(taskAttachment).toBeInstanceOf(TaskAttachment);
    expect(taskAttachment.getUrl().getUrl()).toBe('http://localhost.com/file.png');
    expect(taskAttachment.getType()).toBe(AllowedAttachments.png);
    expect(taskAttachment.getName().getText()).toBe('file.png');
    expect(taskAttachment.getSize().getValue()).toBe(128);
    expect(taskAttachment.getTaskId().getID()).toBe('4043c815-7220-7d64-8c42-6f2af4f9fd37');

    const events = taskAttachment.pullEvents();
    expect(events).toHaveLength(1);
    expect(events[0]?.getEvent()).toBe('TASK_ATTACHMENT_CREATED');
  });

  it('should serialize to primitives and restore from primitives', () => {
    const taskAttachment = TaskAttachment.create(validAttachment, attachmentId, taskId, actorId, 'create-key');
    const primitives = taskAttachment.toPrimitives();

    expect(primitives).toEqual({
      id: '6043c815-7220-7d64-8c42-6f2af4f9fd37',
      idTask: '4043c815-7220-7d64-8c42-6f2af4f9fd37',
      attachment: {
        url: 'http://localhost.com/file.png',
        type: AllowedAttachments.png,
        name: 'file.png',
        size: 128,
      },
      deletedAt: null,
    });

    const restored = TaskAttachment.fromPrimitives(primitives);
    expect(restored.getTaskId().getID()).toBe(primitives.idTask);
    expect(restored.getName().getText()).toBe('file.png');
    expect(restored.toPrimitives().attachment.url).toBe(primitives.attachment.url);
  });

  it('should change the attachment name and emit a name changed event', () => {
    const taskAttachment = TaskAttachment.create(validAttachment, attachmentId, taskId, actorId, 'create-key');
    taskAttachment.pullEvents();

    taskAttachment.changeName(new Text('updated-file.png'), actorId, 'name-change-key');

    expect(taskAttachment.getName().getText()).toBe('updated-file.png');
    const events = taskAttachment.pullEvents();
    expect(events).toHaveLength(1);
    expect(events[0]?.getEvent()).toBe('TASK_ATTACHMENT_NAME_CHANGED');
  });

  it('should delete the task attachment and emit a deleted event', () => {
    const taskAttachment = TaskAttachment.create(validAttachment, attachmentId, taskId, actorId, 'create-key');
    taskAttachment.pullEvents();

    taskAttachment.delete(actorId, 'delete-key');
    const events = taskAttachment.pullEvents();

    expect(events).toHaveLength(1);
    expect(events[0]?.getEvent()).toBe('TASK_ATTACHMENT_DELETED');
  });
});
