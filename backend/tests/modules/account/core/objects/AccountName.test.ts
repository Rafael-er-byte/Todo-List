import AccountName from '../../../../../src/modules/user/account/core/objects/AccountName';
import { describe, it, expect } from 'vitest';

describe('AccountName value object', () => {
  it('creates with valid text', () => {
    expect(new AccountName('My account')).toBeInstanceOf(AccountName);
  });

  it('throws on invalid text', () => {
    expect(() => new AccountName('')).toThrow();
  });
});
