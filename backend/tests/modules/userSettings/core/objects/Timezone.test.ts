import { describe, expect, it } from 'vitest';
import Timezone from '../../../../../src/modules/user/userSettings/core/objects/Timezone';
import InvalidTimezone from '../../../../../src/modules/user/userSettings/core/errors/InvalidTimezone';

describe('Timezone value object', () => {
  it('accepts valid timezone formats', () => {
    const timezone = new Timezone('America/Argentina/Buenos_Aires');

    expect(timezone.getTimezone()).toBe('America/Argentina/Buenos_Aires');
  });

  it('throws for invalid timezone format', () => {
    expect(() => new Timezone('UTC')).toThrow(InvalidTimezone);
    expect(() => new Timezone('')).toThrow(InvalidTimezone);
  });
});
