import DateTime from "../../../../../../src/modules/shared/core/objects/DateTime";
import DeletedAt from "../../../../../../src/modules/shared/core/objects/DeletedAt";
import None from "../../../../../../src/modules/shared/core/objects/None";
import { describe, it, expect } from 'vitest';

describe('DeletedAt', () => {

  describe('createActive()', () => {

    it('should create an active DeletedAt with None', () => {
      const deletedAt = DeletedAt.createActive();

      expect(deletedAt.exists()).toBe(true);
      expect(deletedAt.getDeletedTime()).toBeInstanceOf(None);
    });

  });

  describe('createDeleted()', () => {

    it('should create a deleted DeletedAt with a DateTime', () => {
      const now = DateTime.now();
      const deletedAt = DeletedAt.createDeleted(now);

      expect(deletedAt.exists()).toBe(false);
      expect(deletedAt.getDeletedTime()).toBeInstanceOf(DateTime);
    });

  });

  describe('delete()', () => {

    it('should create a deleted DeletedAt with current time', () => {
      const before = Date.now();
      const deletedAt = DeletedAt.delete();
      const after = Date.now();

      expect(deletedAt.exists()).toBe(false);
      expect(deletedAt.getDeletedTime()).toBeInstanceOf(DateTime);

      const value = (deletedAt.getDeletedTime() as DateTime).getValue();
      expect(value).toBeGreaterThanOrEqual(before);
      expect(value).toBeLessThanOrEqual(after);
    });

  });

  describe('getDeletedTime()', () => {

    it('should return None for an active entity', () => {
      const deletedAt = DeletedAt.createActive();

      expect(deletedAt.getDeletedTime()).toBeInstanceOf(None);
    });

    it('should return DateTime for a deleted entity', () => {
      const now = DateTime.now();
      const deletedAt = DeletedAt.createDeleted(now);

      expect(deletedAt.getDeletedTime()).toBeInstanceOf(DateTime);
      expect((deletedAt.getDeletedTime() as DateTime).getValue()).toBe(now.getValue());
    });

  });

});