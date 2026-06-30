import Account from '../../../../../src/modules/account/core/model/Account';
import IdAccount from '../../../../../src/modules/account/core/objects/IdAccount';
import IdEntity from '../../../../../src/modules/shared/core/objects/IdEntity';
import ID from '../../../../../src/modules/shared/core/objects/ID';
import Email from '../../../../../src/modules/shared/core/objects/Email';
import AccountName from '../../../../../src/modules/account/core/objects/AccountName';
import Url from '../../../../../src/modules/shared/core/objects/URL';
import None from '../../../../../src/modules/shared/core/objects/None';
import InvalidParameters from '../../../../../src/modules/shared/core/errors/InvalidParameters';
import { describe, it, expect } from 'vitest';

describe('Account model', () => {
  it('create builds account with current signature', () => {
    const id = new IdAccount(ID.generateId().getId());
    const owner = new IdEntity(ID.generateId().getId());
    const email = new Email('test@example.com');
    const name = new AccountName('Test');
    const profileImage = new Url('https://example.com/photo.png');

    const account = Account.create(id, email, name, 'google', profileImage, owner, true);
    const primitives = account.toPrimitives();

    expect(primitives.id).toBe(id.getID());
    expect(primitives.userId).toBe(owner.getID());
    expect(primitives.email).toBe('test@example.com');
    expect(primitives.name).toBe('Test');
    expect(primitives.provider).toBe('google');
    expect(primitives.profileImage).toBe('https://example.com/photo.png');
    expect(primitives.isPrimary).toBe(true);
    expect(primitives.createdAt).toBeInstanceOf(Date);
  });

  it('fromPrimitives and toPrimitives roundtrip with null profile image', () => {
    const primitives = {
      id: ID.generateId().getId(),
      email: 'test2@example.com',
      name: 'Test 2',
      provider: 'local',
      profileImage: null,
      userId: ID.generateId().getId(),
      createdAt: new Date(),
      isPrimary: false,
    };

    const account = Account.fromPrimitives(primitives);
    const round = account.toPrimitives();

    expect(account.getProfileImage()).toBeInstanceOf(None);
    expect(account.getEmail().getEmail()).toBe(primitives.email);
    expect(account.getName().getName()).toBe(primitives.name);
    expect(round.id).toBe(primitives.id);
    expect(round.email).toBe(primitives.email);
    expect(round.name).toBe(primitives.name);
    expect(round.provider).toBe(primitives.provider);
    expect(round.profileImage).toBeNull();
    expect(round.userId).toBe(primitives.userId);
    expect(round.isPrimary).toBe(false);
    expect(round.createdAt).toBeInstanceOf(Date);
  });

  it('fromPrimitives throws when provider is missing', () => {
    const primitives = {
      id: ID.generateId().getId(),
      email: 'test3@example.com',
      name: 'Test 3',
      provider: '',
      profileImage: null,
      userId: ID.generateId().getId(),
      createdAt: new Date(),
      isPrimary: false,
    };

    expect(() => Account.fromPrimitives(primitives)).toThrow(InvalidParameters);
    expect(() => Account.fromPrimitives(primitives)).toThrow('The provider is required');
  });

  it('fromPrimitives throws when createdAt is missing', () => {
    const primitives = {
      id: ID.generateId().getId(),
      email: 'test4@example.com',
      name: 'Test 4',
      provider: 'local',
      profileImage: null,
      userId: ID.generateId().getId(),
      isPrimary: true,
    };

    expect(() => Account.fromPrimitives(primitives as any)).toThrow(InvalidParameters);
    expect(() => Account.fromPrimitives(primitives as any)).toThrow('The account must include a creation date');
  });
});
