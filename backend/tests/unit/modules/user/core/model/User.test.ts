import User from '../../../../../../src/modules/user/user/core/model/User';
import IdEntity from '../../../../../../src/modules/shared/core/objects/IdEntity';
import ID from '../../../../../../src/modules/shared/core/objects/ID';
import { describe, it, expect } from 'vitest';
import UserParams from '../../../../../../src/modules/user/user/core/interfaces/UserParams';
import DuplicateAccount from '../../../../../../src/modules/user/user/core/errors/DuplicateAccount';
import InvalidOperation from '../../../../../../src/modules/shared/core/errors/InvalidOperation';
import AccountDoesntExist from '../../../../../../src/modules/user/user/core/errors/AccountDoesntExist';

describe('User entity', () => {

  const DEFAULT_ID = '0143c815-7220-7d64-8c42-6f2af4f9fd37';
  const SECOND_ACCOUNT = '019df05a-8588-758c-b5e7-92af14bf85d0';

  const params: UserParams = {
    id: DEFAULT_ID,
    name: 'John Doe',
    primaryAccount: DEFAULT_ID,
    accounts: [DEFAULT_ID],
  };

  it('fromPrimitives maps all expected primitives', () => {
    const user = User.fromPrimitives(params);

    expect(user.getAccounts().length).toBe(1);
    expect(user.getPrimaryAccount().toString()).toBe(DEFAULT_ID);
    expect(user.getName().getName()).toBe(params.name);
  });

  it('throws when reading primary account and it does not exist', () => {
    const user = User.fromPrimitives({
      ...params,
      primaryAccount: undefined,
    });

    expect(() => user.getPrimaryAccount()).toThrow(InvalidOperation);
  });

  it('throws when adding duplicate account', () => {
    const user = User.fromPrimitives(params);
    const acc = new IdEntity(DEFAULT_ID);
    
    expect(() => user.addAccount(acc)).toThrow(DuplicateAccount);
  });

  it('changePrimaryAccount updates the primary account', () => {
    const user = User.fromPrimitives(params);
    const newPrimary = new IdEntity(SECOND_ACCOUNT);
    user.addAccount(newPrimary);
    user.changePrimaryAccount(newPrimary);

    expect(user.getPrimaryAccount().toString()).toBe(newPrimary.toString());
  });

  it('removes an account', () => {
    const user = User.fromPrimitives(params);
    const acc = new IdEntity(ID.generateId().toString());
    user.addAccount(acc);
  
    expect(user.getAccounts().length).toBe(2);

    user.removeAccount(acc);
    expect(user.getAccounts().length).toBe(1);
    expect(user.getAccounts()[0].toString()).toStrictEqual(DEFAULT_ID);
  });

  it('throws if trying to remove the last account', () => {
    const user = User.fromPrimitives(params);
    expect(() => user.removeAccount(new IdEntity(DEFAULT_ID))).toThrow(InvalidOperation);
  });

  it('throws if the account being removed does not exist', () => {
    const user = User.fromPrimitives(params);

    expect(() => user.removeAccount(new IdEntity(ID.generateId().toString()))).toThrow(AccountDoesntExist);
  });

  it('takes the first account as primary when removing the current primary account', () => {
    const user = User.fromPrimitives(params);
    const newPrimary = new IdEntity(SECOND_ACCOUNT);
    user.addAccount(newPrimary);
    user.changePrimaryAccount(newPrimary);

    expect(user.getPrimaryAccount().toString()).toBe(newPrimary.toString());

    user.removeAccount(newPrimary);

    expect(user.getPrimaryAccount().toString()).toBe(DEFAULT_ID);
  });
});
