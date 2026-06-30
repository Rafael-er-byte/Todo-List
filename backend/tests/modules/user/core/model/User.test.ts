import User from '../../../../../src/modules/user/user/core/model/User';
import IdEntity from '../../../../../src/modules/shared/core/objects/IdEntity';
import ID from '../../../../../src/modules/shared/core/objects/ID';
import { describe, it, expect } from 'vitest';
import UserParams from '../../../../../src/modules/user/user/core/interfaces/UserParams';
import DuplicateAccount from '../../../../../src/modules/user/user/core/errors/DuplicateAccount';
import AccountChanged from '../../../../../src/modules/user/user/core/events/AccountChanged';
import InvalidOperation from '../../../../../src/modules/shared/core/errors/InvalidOperation';
import AccountDoesntExist from '../../../../../src/modules/user/user/core/errors/AccountDoesntExist';

describe('User entity', () => {

  const DEFAULT_ID = '0143c815-7220-7d64-8c42-6f2af4f9fd37';

  const params = {
      id: DEFAULT_ID,
      primaryAccount: DEFAULT_ID,
      accounts: [DEFAULT_ID]
    };

  it('fromPrimitives and add account sets primary when none', () => {
    const user = User.fromPrimitives(params as UserParams);
    console.log(user.getAccounts);

    expect(user.getAccounts().length).toBe(1);
    expect(user.getPrimaryAccount().getID()).toBe(DEFAULT_ID);
  });

  it('throws when adding duplicate account', () => {
    const user = User.fromPrimitives(params as UserParams);
    const acc = new IdEntity(DEFAULT_ID);
    
    expect(() => user.addAccount(acc)).toThrow(DuplicateAccount);
  });

  it('changePrimaryAccount emits ACCOUNT_CHANGED event with previous info', () => {
    const user = User.fromPrimitives(params as UserParams);
    const newPrimary = new IdEntity(ID.generateId().toString());
    user.addAccount(newPrimary);
    user.changePrimaryAccount(newPrimary);

    const events = user.pullEvents();
  
    expect(events.length).toBeGreaterThan(0);
    expect(events[0]).toBeInstanceOf(AccountChanged);
  });

  it("Should remove an account", () => {
    const user = User.fromPrimitives(params as UserParams);
    const acc = new IdEntity(ID.generateId().toString());
    user.addAccount(acc);
  
    expect(user.getAccounts().length === 2);

    user.removeAccount(acc);
    expect(user.getAccounts().length === 2);
    expect(user.getAccounts()[0].getID()).toStrictEqual(DEFAULT_ID);
  });

  it("Should throw if try to remove the last account", () => {
    const user = User.fromPrimitives(params as UserParams);
    expect(() => user.removeAccount(new IdEntity(DEFAULT_ID))).toThrow(InvalidOperation);
  });

  it("Should throw if the account tring to remove doesnt exists", () => {
    const user = User.fromPrimitives(params as UserParams);

    expect(() => user.removeAccount(new IdEntity(ID.generateId().toString()))).toThrow(AccountDoesntExist)
  });

  it("Should take the first account as the primary in case that remove the primary account", () => {
    const user = User.fromPrimitives(params as UserParams);
    const newPrimary = new IdEntity(ID.generateId().toString());
    user.addAccount(newPrimary);
    user.changePrimaryAccount(newPrimary);

    expect(user.getPrimaryAccount().getID()).toBe(newPrimary.getID());

    user.removeAccount(newPrimary);

    expect(user.getPrimaryAccount().getID()).toBe(DEFAULT_ID);
  });
});
