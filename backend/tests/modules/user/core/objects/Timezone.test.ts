import Timezone from '../../../../../src/modules/userSettings/core/objects/Timezone';
import InvalidTimezone from '../../../../../src/modules/userSettings/core/errors/InvalidTimezone';
import { describe, it, expect } from 'vitest';

describe('Timezone value object', () => {
  it('accepts valid IANA timezone', () => {
    expect(new Timezone('Europe/Madrid')).toBeInstanceOf(Timezone);
    expect(new Timezone('America/New_York')).toBeInstanceOf(Timezone);
  });

  it('throws for invalid timezone format', () => {
    expect(() => new Timezone('GMT')).toThrow(InvalidTimezone);
    expect(() => new Timezone('')).toThrow(InvalidTimezone);
  });
});
