import User from '../../../../../src/modules/user/core/model/User';
import IdEntity from '../../../../../src/modules/shared/core/objects/IdEntity';
import ID from '../../../../../src/modules/shared/core/objects/ID';
import { describe, it, expect } from 'vitest';

describe('User entity', () => {
  it('fromPrimitives and add account sets primary when none', () => {
    const params = {
      id: ID.generateId().getId(),
      accounts: [],
      primaryAccount: null,
    };
    const user = User.fromPrimitives(params as any);
    const acc = new IdEntity(ID.generateId().getId());
    user.addAccount(acc);
    expect(user.getAccounts().length).toBe(1);
    expect(user.getPrimaryAccount()).not.toBeNull();
  });

  it('throws when adding duplicate account', () => {
    const params = {
      id: ID.generateId().getId(),
      accounts: [],
      primaryAccount: null,
    };
    const user = User.fromPrimitives(params as any);
    const acc = new IdEntity(ID.generateId().getId());
    user.addAccount(acc);
    expect(() => user.addAccount(acc)).toThrow();
  });

  it('changePrimaryAccount emits ACCOUNT_CHANGED event with previous info', () => {
    const existing = ID.generateId().getId();
    const params = {
      id: ID.generateId().getId(),
      accounts: [existing],
      primaryAccount: existing,
    };
    const user = User.fromPrimitives(params as any);
    const actor = new IdEntity(ID.generateId().getId());
    const newPrimary = new IdEntity(ID.generateId().getId());
    user.addAccount(newPrimary);
    user.changePrimaryAccount('k1', actor, newPrimary);
    const events = user.pullEvents();
    expect(events.length).toBeGreaterThan(0);
    expect(events[0].getEvent()).toBe('ACCOUNT_CHANGED');
    const info = events[0].getInfo() as any;
    expect(info.previousPrimary).toBe(existing);
  });
});
