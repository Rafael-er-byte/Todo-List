import { describe, it, expect } from 'vitest';
import TaskAttachment from '../../../../../../src/modules/project/taskAttachment/core/model/TaskAttachment';
import Attachment from '../../../../../../src/modules/shared/core/objects/Attachment';
import Url from '../../../../../../src/modules/shared/core/objects/URL';
import Text from '../../../../../../src/modules/shared/core/objects/Text';
import IntNumber from '../../../../../../src/modules/shared/core/objects/IntNumber';
import { AllowedAttachments } from '../../../../../../src/modules/shared/core/types/AllowedAttachment.types';
import IdEntity from '../../../../../../src/modules/shared/core/objects/IdEntity';

describe('TaskAttachment entity tests', () => {
  const validUrl = new Url('http://localhost.com/file.png');
  const validAttachment = new Attachment(validUrl, AllowedAttachments.png, new Text('file.png'), new IntNumber(128));
  const taskId = '4043c815-7220-7d64-8c42-6f2af4f9fd37';
  const actorId = '5043c815-7220-7d64-8c42-6f2af4f9fd37';
  const attachmentId = '6043c815-7220-7d64-8c42-6f2af4f9fd37';

  it('should create a TaskAttachment and expose attachment information', () => {
    const taskAttachment = TaskAttachment.create({
      id: attachmentId,
      idTask: taskId,
      actor: actorId,
      key: 'create-key',
      attachment: {
        url: validAttachment.getUrl().getUrl(),
        type: validAttachment.getType(),
        name: validAttachment.getName().getText(),
        size: validAttachment.getSize().getValue(),
      },
    });

    expect(taskAttachment).toBeInstanceOf(TaskAttachment);
    expect(taskAttachment.getUrl().getUrl()).toBe('http://localhost.com/file.png');
    expect(taskAttachment.getType()).toBe(AllowedAttachments.png);
    expect(taskAttachment.getName().getText()).toBe('file.png');
    expect(taskAttachment.getSize().getValue()).toBe(128);
    expect(taskAttachment.getTaskId().toString()).toBe('4043c815-7220-7d64-8c42-6f2af4f9fd37');

    const events = taskAttachment.pullEvents();
    expect(events).toHaveLength(1);
    expect(events[0]?.getEvent()).toBe('TASK_ATTACHMENT_CREATED');
  });

  it('should serialize to primitives and restore from primitives', () => {
    const taskAttachment = TaskAttachment.create({
      id: attachmentId,
      idTask: taskId,
      actor: actorId,
      key: 'create-key',
      attachment: {
        url: validAttachment.getUrl().getUrl(),
        type: validAttachment.getType(),
        name: validAttachment.getName().getText(),
        size: validAttachment.getSize().getValue(),
      },
    });
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
    });

    const restored = TaskAttachment.fromPrimitives(primitives);
    expect(restored.getTaskId().toString()).toBe(primitives.idTask);
    expect(restored.getName().getText()).toBe('file.png');
    expect(restored.toPrimitives().attachment.url).toBe(primitives.attachment.url);
  });

  it('should change the attachment name and emit a name changed event', () => {
    const taskAttachment = TaskAttachment.create({
      id: attachmentId,
      idTask: taskId,
      actor: actorId,
      key: 'create-key',
      attachment: {
        url: validAttachment.getUrl().getUrl(),
        type: validAttachment.getType(),
        name: validAttachment.getName().getText(),
        size: validAttachment.getSize().getValue(),
      },
    });
    taskAttachment.pullEvents();

    taskAttachment.changeName(new Text('updated-file.png'), new IdEntity(actorId), 'name-change-key');

    expect(taskAttachment.getName().getText()).toBe('updated-file.png');
    const events = taskAttachment.pullEvents();
    expect(events).toHaveLength(1);
    expect(events[0]?.getEvent()).toBe('TASK_ATTACHMENT_NAME_CHANGED');
  });

  it('should delete the task attachment and emit a deleted event', () => {
    const taskAttachment = TaskAttachment.create({
      id: attachmentId,
      idTask: taskId,
      actor: actorId,
      key: 'create-key',
      attachment: {
        url: validAttachment.getUrl().getUrl(),
        type: validAttachment.getType(),
        name: validAttachment.getName().getText(),
        size: validAttachment.getSize().getValue(),
      },
    });
    taskAttachment.pullEvents();

    taskAttachment.delete(new IdEntity(actorId), 'delete-key');
    const events = taskAttachment.pullEvents();

    expect(events).toHaveLength(1);
    expect(events[0]?.getEvent()).toBe('TASK_ATTACHMENT_DELETED');
  });
});
