import Account from '../../../../../src/modules/user/account/core/model/Account';
import ID from '../../../../../src/modules/shared/core/objects/ID';
import None from '../../../../../src/modules/shared/core/objects/None';
import InvalidParameters from '../../../../../src/modules/shared/core/errors/InvalidParameters';
import { describe, it, expect } from 'vitest';

describe('Account model', () => {
  it('create builds account with primitive params', () => {
    const id = ID.generateId().toString();
    const userId = ID.generateId().toString();

    const account = Account.create({
      id,
      userId,
      email: 'test@example.com',
      name: 'Test',
      provider: 'google',
      profileImage: 'https://example.com/photo.png',
      isPrimary: true,
    });
    const primitives = account.toPrimitives();

    expect(primitives.id).toBe(id);
    expect(primitives.userId).toBe(userId);
    expect(primitives.email).toBe('test@example.com');
    expect(primitives.name).toBe('Test');
    expect(primitives.provider).toBe('google');
    expect(primitives.profileImage).toBe('https://example.com/photo.png');
    expect(primitives.isPrimary).toBe(true);
    expect(primitives.createdAt).toBeInstanceOf(Date);
  });

  it('fromPrimitives and toPrimitives roundtrip with null profile image', () => {
    const primitives = {
      id: ID.generateId().toString(),
      email: 'test2@example.com',
      name: 'Test 2',
      provider: 'local',
      profileImage: null,
      userId: ID.generateId().toString(),
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
      id: ID.generateId().toString(),
      email: 'test3@example.com',
      name: 'Test 3',
      provider: '',
      profileImage: null,
      userId: ID.generateId().toString(),
      createdAt: new Date(),
      isPrimary: false,
    };

    expect(() => Account.fromPrimitives(primitives)).toThrow(InvalidParameters);
    expect(() => Account.fromPrimitives(primitives)).toThrow('The provider is required');
  });

  it('fromPrimitives throws when createdAt is missing', () => {
    const primitives = {
      id: ID.generateId().toString(),
      email: 'test4@example.com',
      name: 'Test 4',
      provider: 'local',
      profileImage: null,
      userId: ID.generateId().toString(),
      isPrimary: true,
    };

    expect(() => Account.fromPrimitives(primitives as any)).toThrow(InvalidParameters);
    expect(() => Account.fromPrimitives(primitives as any)).toThrow('The account must include a creation date');
  });
});
