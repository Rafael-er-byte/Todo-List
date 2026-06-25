import Account from '../../../../../src/modules/account/core/model/Account';
import IdAccount from '../../../../../src/modules/account/core/objects/IdAccount';
import IdEntity from '../../../../../src/modules/shared/core/objects/IdEntity';
import ID from '../../../../../src/modules/shared/core/objects/ID';
import Email from '../../../../../src/modules/shared/core/objects/Email';
import AccountName from '../../../../../src/modules/account/core/objects/AccountName';
import { describe, it, expect } from 'vitest';

describe('Account model', () => {
  it('create emits AccountCreated event', () => {
    const id = new IdAccount(ID.generateId().getId());
    const actor = new IdEntity(ID.generateId().getId());
    const acc = Account.create('k1', id, actor, { email: new Email('test@example.com'), name: new AccountName('Test') });
    const events = acc.pullEvents();
    expect(events.length).toBeGreaterThan(0);
    expect(events[0].getEvent()).toBe('ACCOUNT_CREATED');
  });

  it('fromPrimitives and toPrimitives roundtrip', () => {
    const primitives = {
      id: ID.generateId().getId(),
      email: 'test2@example.com',
      name: 'Test 2',
      provider: 'local',
      profileImage: null,
      userId: null,
      createdAt: new Date(),
      isPrimary: false,
    };
    const account = Account.fromPrimitives(primitives as any);
    const round = account.toPrimitives();
    expect(round.email).toBe(primitives.email);
    expect(round.name).toBe(primitives.name);
  });
});
