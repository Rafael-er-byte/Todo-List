import InvalidParameters from "../../../../../../src/modules/shared/core/errors/InvalidParameters";
import DateTime from "../../../../../../src/modules/shared/core/objects/DateTime";
import { describe, it, expect } from 'vitest';

describe('DateTime ValueObject', () => {

  describe('create()', () => {

    it('should create a DateTime from a valid Date object', () => {
      const date = new Date('2024-01-15T10:30:45Z');

      const dateTime = DateTime.create(date);

      expect(dateTime).toBeInstanceOf(DateTime);
      expect(dateTime.getValue()).toBe(date.getTime());
    });

    it('should throw InvalidParameters for an invalid Date object', () => {
      const invalidDate = new Date('not-a-date');

      expect(() => DateTime.create(invalidDate)).toThrow(InvalidParameters);
    });

  });

  describe('now()', () => {

    it('should create a DateTime close to current time', () => {
      const before = Date.now();

      const now = DateTime.now();

      const after = Date.now();

      expect(now.getValue()).toBeGreaterThanOrEqual(before);
      expect(now.getValue()).toBeLessThanOrEqual(after);
    });

  });

  describe('isAfter()', () => {

    it('should return true if first date is after second', () => {
      const now = DateTime.create(new Date('2024-01-01T00:00:00Z'));
      const future = DateTime.create(new Date('2024-01-02T00:00:00Z'));

      expect(DateTime.isAfter(future, now)).toBe(true);
    });

    it('should return false if first date is before second', () => {
      const now = DateTime.create(new Date('2024-01-02T00:00:00Z'));
      const past = DateTime.create(new Date('2024-01-01T00:00:00Z'));

      expect(DateTime.isAfter(past, now)).toBe(false);
    });

    it('should return false if dates are equal', () => {
      const d1 = DateTime.create(new Date('2024-01-01T00:00:00Z'));
      const d2 = DateTime.create(new Date('2024-01-01T00:00:00Z'));

      expect(DateTime.isAfter(d1, d2)).toBe(false);
    });

  });

  describe('getters()', () => {

    it('getDate should return a Date instance', () => {
      const dt = DateTime.create(new Date('2024-01-01T00:00:00Z'));

      expect(dt.getDate()).toBeInstanceOf(Date);
    });

    it('getValue should return a timestamp number', () => {
      const dt = DateTime.create(new Date('2024-01-01T00:00:00Z'));

      expect(typeof dt.getValue()).toBe('number');
    });

  });

});