import InvalidParameters from "../../../../../src/modules/shared/core/errors/InvalidParameters";
import LimitExceeded from "../../../../../src/modules/shared/core/errors/LimitExceeded";
import TaskRules from "../../../../../src/modules/task/core/constants/TaskRules";
import TaskTitle from "../../../../../src/modules/task/core/objects/TaskTitle";

describe('TaskTitle Value Object', () => {
  it('should create a valid TaskTitle instance', () => {
    const title = new TaskTitle('My task title');
    expect(title).toBeInstanceOf(TaskTitle);
  });

  it('should return the title text', () => {
    const text = 'My task title';
    const title = new TaskTitle(text);

    expect(title.getTitle()).toBe(text);
  });

  it('should throw if title is empty or invalid', () => {
    expect(() => new TaskTitle('')).toThrow(InvalidParameters);
    expect(() => new TaskTitle(undefined as unknown as string)).toThrow(InvalidParameters);
  });

  it('should throw if title exceeds the limit', () => {
    const overLimit = 'a'.repeat(TaskRules.TITLE_LIMIT_SIZE + 1);

    expect(() => new TaskTitle(overLimit)).toThrow(LimitExceeded);
  });
});
