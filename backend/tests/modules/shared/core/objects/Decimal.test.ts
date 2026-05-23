import Decimal from '../../../../../src/modules/shared/core/objects/Decimal';
import InvalidParameters from '../../../../../src/modules/shared/core/errors/InvalidParameters';
import { describe, it, expect } from 'vitest';

describe('Decimal Value Object', () => {
  it('creates a valid Decimal instance', () => {
    const value = new Decimal(12.3456);
    expect(value).toBeInstanceOf(Decimal);
    expect(value.getValue()).toBe(12.35);
  });

  it('returns a primitive numeric value', () => {
    const value = new Decimal(99.999);
    expect(value.toPrimitive()).toBe(100);
  });

  it('adds and subtracts decimal values', () => {
    const base = new Decimal(10.5);
    const addend = new Decimal(2.25);
    const result = base.add(addend);
    expect(result.getValue()).toBe(12.75);
    const difference = base.subtract(new Decimal(1.25));
    expect(difference.getValue()).toBe(9.25);
  });

  it('throws when created with invalid data', () => {
    expect(() => new Decimal(NaN)).toThrow(InvalidParameters);
    expect(() => new Decimal(Infinity)).toThrow(InvalidParameters);
  });
});
