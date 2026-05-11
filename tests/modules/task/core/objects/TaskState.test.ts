import TaskState from "../../../../../src/modules/task/core/objects/TaskState";
import TaskStateNotSupported from "../../../../../src/modules/task/core/error/TaskStateNotSupported";
import { AllowedTaskState } from "../../../../../src/modules/task/core/types/AllowedTaskState";

describe('TaskState Value Object', () => {
  describe('factory methods', () => {
    it('should create a completed state using static factory', () => {
      const state = TaskState.completed();

      expect(state).toBeInstanceOf(TaskState);
      expect(state.isCompleted()).toBe(true);
    });

    it('should create a pending state using static factory', () => {
      const state = TaskState.pending();

      expect(state).toBeInstanceOf(TaskState);
      expect(state.isCompleted()).toBe(false);
    });
  });

  describe('create task state', () => {
    it('should create a TaskState for any allowed value', () => {
      const values = Object.values(AllowedTaskState);

      for (const value of values) {
        const state = TaskState.create(value);
        expect(state).toBeInstanceOf(TaskState);
      }
    });

    it('should throw TaskStateNotSupported for unsupported state', () => {
      const invalid = 'INVALID_STATE' as AllowedTaskState;

      expect(() => TaskState.create(invalid)).toThrow(TaskStateNotSupported);
    });
  });

  describe('isCompleted()', () => {
    it('should return true when state is completed', () => {
      const state = TaskState.completed();
      expect(state.isCompleted()).toBe(true);
    });

    it('should return false when state is pending', () => {
      const state = TaskState.pending();
      expect(state.isCompleted()).toBe(false);
    });
  });
});
