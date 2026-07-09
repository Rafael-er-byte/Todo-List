import { describe, it, expect } from 'vitest';
import Email from '../../../../../../src/modules/shared/core/objects/Email';

describe('Shared Email value object', () => {
  it('accepts valid emails', () => {
    const email = new Email('User@Example.COM');
    expect(email.getEmail()).toBe('user@example.com');
  });

  it('rejects invalid emails', () => {
    expect(() => new Email('bad-email')).toThrow();
    expect(() => new Email('no-at-sign.com')).toThrow();
    expect(() => new Email('no-domain@')).toThrow();
  });
});
